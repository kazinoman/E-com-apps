/**
 * Response envelope for the mock API.
 *
 * These helpers reproduce the real merchant backend's global
 * ResponseEnvelopeInterceptor byte for byte, so the app cannot tell the two
 * apart. Switch between them with NEXT_PUBLIC_API_BASE:
 *
 *   http://127.0.0.1:3000/api/v1   real backend
 *   http://127.0.0.1:3001/api/v1   this mock
 *
 * The contract, captured live on 2026-09-15:
 *   success     {success:true,  message, data, timestamp}
 *   paginated   ...plus `pagination` as a SIBLING of data, not nested in it
 *   error       {success:false, message, errorCode, errors:[], timestamp}
 *
 * Responses are camelCase. Requests are snake_case. That asymmetry is real and
 * deliberate on the backend — preserve it here or the mock stops being useful.
 */
import { NextResponse } from "next/server";

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface FieldError {
  field: string;
  message: string;
}

const now = () => new Date().toISOString();

/** Success with an arbitrary payload. */
export function ok<T>(data: T, message = "Success", status = 200) {
  return NextResponse.json(
    { success: true, message, data, timestamp: now() },
    { status },
  );
}

/** Success with a page of items. `pagination` sits beside `data`, not inside. */
export function okPaginated<T>(
  items: T[],
  pagination: Pagination,
  message = "Success",
  status = 200,
) {
  return NextResponse.json(
    { success: true, message, data: { items }, pagination, timestamp: now() },
    { status },
  );
}

/** Any failure. `errors` stays an empty array unless this is a validation error. */
export function fail(
  message: string,
  errorCode: string,
  status = 400,
  errors: FieldError[] = [],
) {
  return NextResponse.json(
    { success: false, message, errorCode, errors, timestamp: now() },
    { status },
  );
}

/**
 * 400 VALIDATION_ERROR. Field names are snake_case because they name the
 * REQUEST body, which is snake_case — e.g. `product_id`, not `productId`.
 */
export function validationError(errors: FieldError[]) {
  return fail("Validation failed", "VALIDATION_ERROR", 400, errors);
}

/** 401. The real backend returns this for a missing or invalid buyer_session. */
export function unauthorized() {
  return fail("Unauthorized", "UNAUTHORIZED", 401);
}

/** 404 with a resource-specific code, e.g. notFound("Product", "PRODUCT_NOT_FOUND"). */
export function notFound(what: string, errorCode: string) {
  return fail(`${what} not found`, errorCode, 404);
}
