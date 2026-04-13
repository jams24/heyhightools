import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/inventpay";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("x-webhook-signature");

    console.log("[Webhook] Received event");

    if (!signature || !process.env.INVENTPAY_WEBHOOK_SECRET) {
      console.log("[Webhook] Missing signature or secret");
      // Always return 200 to prevent InventPay retries
      return NextResponse.json({ received: true });
    }

    const isValid = verifyWebhookSignature(
      payload,
      signature,
      process.env.INVENTPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      console.log("[Webhook] Invalid signature");
      return NextResponse.json({ received: true });
    }

    const event = JSON.parse(payload);

    // Handle both flat and nested payload formats
    const paymentId = event.paymentId || event.data?.paymentId;
    const status = event.status || event.data?.status;
    const eventType = event.event;

    console.log("[Webhook] Event:", eventType, "PaymentId:", paymentId, "Status:", status);

    const statusMap: Record<string, string> = {
      COMPLETED: "paid",
      SETTLED: "paid",
      EXPIRED: "expired",
      FAILED: "failed",
    };

    const newStatus = statusMap[status];
    if (!newStatus || !paymentId) {
      console.log("[Webhook] Ignoring - status:", status);
      return NextResponse.json({ received: true });
    }

    // Find order by paymentId
    const order = await prisma.order.findUnique({
      where: { paymentId },
    });

    if (!order) {
      console.log("[Webhook] Order not found for paymentId:", paymentId);
      return NextResponse.json({ received: true });
    }

    // Idempotency: skip if already in a final state
    if (order.status === "paid" || order.status === "delivered") {
      console.log("[Webhook] Order already", order.status, "- skipping");
      return NextResponse.json({ received: true });
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });

    console.log("[Webhook] Order", order.id, "updated:", order.status, "→", newStatus);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Webhook] Error:", err);
    // Always return 200 to prevent InventPay retries
    return NextResponse.json({ received: true });
  }
}
