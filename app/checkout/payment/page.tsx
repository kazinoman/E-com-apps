import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/common/Container";
import { getOrder } from "@/services/order.service";
import { isPaymentOutcome, readPendingOrder, type PaymentOutcome } from "@/lib/pending-order";
import { statusLabel, taka, type Order } from "@/types/order";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Payment | Zaag" };

/*
 * Where the shopper lands after the gateway.
 *
 * There is deliberately no checkout step spine on this page. This is not a
 * step forward — the outcome may be "cancelled" or "failed", and drawing it as
 * progress would assert something the verdict below explicitly refuses to
 * assert.
 */

type Tone = "success" | "warning" | "error";
interface Verdict {
  tone: Tone;
  title: string;
  body: string;
}

/**
 * What to tell the shopper.
 *
 * The **order's status** decides this, never the URL the gateway sent them
 * back through. That URL is unauthenticated, and more importantly the
 * gateway's own "success" page is shown before the IPN webhook has
 * re-validated the transaction server-to-server. Claiming "paid" on the
 * strength of a redirect would be a lie we could not back up, so an
 * unconfirmed payment says exactly that.
 */
function verdictFor(order: Order, outcome: PaymentOutcome | null): Verdict {
  switch (order.status) {
    case "paid":
    case "confirmed":
      return {
        tone: "success",
        title: "Payment received",
        body: "Your payment is confirmed and the order is with us. We'll start preparing your parcel.",
      };
    case "shipped":
    case "delivered":
      return {
        tone: "success",
        title: "Payment received",
        body: "This order is already paid and on its way.",
      };
    case "cancelled":
      return {
        tone: "error",
        title: "This order was cancelled",
        body: "Nothing was charged. You can put the items back in your cart and order again.",
      };
    case "refunded":
      return {
        tone: "warning",
        title: "This order was refunded",
        body: "The payment has been returned. Contact us if anything looks wrong.",
      };
  }

  // pending / awaiting_payment — the payment has not landed.
  if (outcome === "success") {
    return {
      tone: "warning",
      title: "Payment not confirmed yet",
      body: "The gateway says your payment went through, but we haven't had the confirmation from them yet. This usually takes a moment. Reload this page, or check your orders shortly — nothing else is needed from you.",
    };
  }
  if (outcome === "cancel") {
    return {
      tone: "warning",
      title: "Payment cancelled",
      body: "You cancelled at the payment page, so nothing was charged. The order is still open and unpaid.",
    };
  }
  if (outcome === "fail") {
    return {
      tone: "error",
      title: "Payment did not go through",
      body: "The gateway couldn't complete the payment, so nothing was charged. The order is still open and unpaid.",
    };
  }
  return {
    tone: "warning",
    title: "Payment not completed",
    body: "We couldn't start or finish the payment for this order. Nothing has been charged and the order is still open and unpaid.",
  };
}

const TONES: Record<Tone, string> = {
  success: "bg-[#E3F9ED] text-[#137a48] border-[#22C55E]/30",
  warning: "bg-[#FFF7E6] text-[#8a6100] border-[#FFB800]/40",
  error: "bg-[#FEE2E2] text-[#9b1c1c] border-[#EF4444]/30",
};

export default async function PaymentReturnPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.outcome) ? sp.outcome[0] : sp.outcome;
  const outcome: PaymentOutcome | null = isPaymentOutcome(raw) ? raw : null;

  // The order comes from the httpOnly cookie written at checkout, never from
  // the query string — an order id in the URL would let anyone read back
  // someone else's order by editing it.
  const orderId = await readPendingOrder();
  if (!orderId) redirect("/profile/orders/active");

  const order = await getOrder(orderId);
  // The cookie outlived the order, or this is not our order to show. Send them
  // somewhere true rather than guessing.
  if (!order) redirect("/profile/orders/active");

  const verdict = verdictFor(order, outcome);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-12">
      <Container className="max-w-2xl">
        <div className={`rounded-xl border p-6 mb-8 ${TONES[verdict.tone]}`}>
          <p className="text-[16px] font-bold">{verdict.title}</p>
          <p className="mt-1 text-[14px] leading-relaxed">{verdict.body}</p>
        </div>

        <div className="bg-[#F9FAFB] dark:bg-gray-900 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#8C93A3]">Order</span>
            <span className="text-[14px] font-bold text-[#1C244B] dark:text-white">{order.orderNo}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] text-[#8C93A3]">Status</span>
            <span className="text-[14px] font-medium text-[#1C244B] dark:text-white">
              {statusLabel(order.status)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
            <span className="text-[15px] font-bold text-[#1C244B] dark:text-white">Total</span>
            <span className="text-[17px] font-bold text-[#1C244B] dark:text-white">
              {taka(order.grandTotalBdt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <Link
            href={`/profile/orders/${order.id}`}
            className="bg-[#333333] hover:bg-black text-white px-6 py-3 rounded-lg text-[13px] font-bold transition-colors"
          >
            See order details
          </Link>
          <Link href="/" className="text-[13px] font-semibold text-[#4A85F6] hover:underline">
            Continue shopping
          </Link>
        </div>
      </Container>
    </div>
  );
}
