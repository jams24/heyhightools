import crypto from "crypto";

const INVENTPAY_BASE_URL = "https://api.inventpay.io";

export async function createInvoice(params: {
  amount: number;
  orderId: string;
  description?: string;
  callbackUrl?: string;
}) {
  const res = await fetch(`${INVENTPAY_BASE_URL}/v1/create_invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.INVENTPAY_API_KEY!,
    },
    body: JSON.stringify({
      amount: params.amount,
      amountCurrency: "USD",
      orderId: params.orderId,
      description: params.description || `HeyHighToolz Order #${params.orderId}`,
      ...(params.callbackUrl ? { callbackUrl: params.callbackUrl } : {}),
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`InventPay error: ${error}`);
  }

  const json = await res.json();
  return json.data;
}

export async function getPaymentStatus(paymentId: string) {
  const res = await fetch(
    `${INVENTPAY_BASE_URL}/v1/invoice/${paymentId}/status`
  );
  if (!res.ok) throw new Error("Failed to fetch payment status");
  const json = await res.json();
  return json.data || json;
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // timingSafeEqual requires same-length buffers
    const sigBuf = Buffer.from(signature, "utf8");
    const expBuf = Buffer.from(expected, "utf8");

    if (sigBuf.length !== expBuf.length) return false;

    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}
