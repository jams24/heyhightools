import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/inventpay";

interface CheckoutItem {
  productName: string;
  planLabel: string;
  price: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { email, whatsapp, items } = await req.json();

    if (!email || !items || items.length === 0) {
      return NextResponse.json({ error: "Email and items are required" }, { status: 400 });
    }

    const total = items.reduce(
      (sum: number, item: CheckoutItem) => sum + item.price * item.quantity,
      0
    );

    // Create order in DB
    const order = await prisma.order.create({
      data: {
        email,
        whatsapp: whatsapp || null,
        total,
        items: {
          create: items.map((item: CheckoutItem) => ({
            productName: item.productName,
            planLabel: item.planLabel,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Create InventPay invoice
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const isPublicUrl = appUrl.startsWith("https://");

    const invoice = await createInvoice({
      amount: total,
      orderId: order.id,
      description: `HeyHighToolz Order - ${items.map((i: CheckoutItem) => i.productName).join(", ")}`,
      callbackUrl: isPublicUrl ? `${appUrl}/api/webhooks/inventpay` : undefined,
    });

    // Update order with payment info
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: invoice.paymentId,
        invoiceUrl: invoice.invoiceUrl,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      invoiceUrl: invoice.invoiceUrl,
      paymentId: invoice.paymentId,
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
