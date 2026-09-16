import { isPaymentOutcome } from "@/lib/pending-order";

/**
 * Where SSLCommerz drops the shopper back on the storefront.
 *
 * The backend's own return handlers (`GET /payments/sslcommerz/{success,fail,
 * cancel}/:order_id`) answer JSON — they are a best-effort status lookup, not
 * a page a human should land on. The authoritative signal is the IPN webhook
 * the gateway posts server-to-server, which is what actually moves the order
 * to `paid`. So the deployment points the three gateway return URLs at these
 * storefront routes instead:
 *
 *   https://<storefront>/checkout/payment/success
 *   https://<storefront>/checkout/payment/fail
 *   https://<storefront>/checkout/payment/cancel
 *
 * The gateway returns the shopper with a **form POST**, so this must be a
 * Route Handler, not a page. Two things follow:
 *
 *  - That POST is cross-site, so the browser sends no `sameSite=lax` cookies
 *    with it. Nothing here reads a cookie, so that is fine. It answers **303**,
 *    which forces the browser to follow with a GET — a top-level same-site
 *    navigation that does carry the session and the pending-order cookie.
 *    `redirect()` from next/navigation answers 307 and preserves the POST,
 *    which would be exactly wrong.
 *  - The gateway's form body is discarded deliberately. It is unauthenticated,
 *    attacker-forgeable input. The only thing taken from the round trip is
 *    which of the three URLs was used, and even that reaches the shopper as a
 *    claim, never as the order's status.
 *
 * No order reference goes into the redirect URL — the landing page matches the
 * shopper to their order through the httpOnly `pending_payment_order` cookie.
 */
function landing(request: Request, outcome: string): Response {
  const url = new URL("/checkout/payment", request.url);
  url.searchParams.set("outcome", outcome);
  return Response.redirect(url, 303);
}

async function handle(
  request: Request,
  ctx: { params: Promise<{ outcome: string }> },
): Promise<Response> {
  const { outcome } = await ctx.params;
  if (!isPaymentOutcome(outcome)) {
    return new Response("Not found", { status: 404 });
  }
  return landing(request, outcome);
}

export const GET = handle;
export const POST = handle;
