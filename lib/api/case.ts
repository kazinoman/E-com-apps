/**
 * Case conversion at the API boundary.
 *
 * The merchant backend is deliberately asymmetric:
 *
 *   requests   snake_case   product_id, sku_external_id, page_size, address_id
 *   responses  camelCase    unitPriceBdt, lineTotalBdt, imageUrl, pageSize
 *
 * Responses arrive camelCase already — a global ResponseEnvelopeInterceptor
 * camelizes them server-side — so nothing here touches them. Only outbound
 * bodies and query params are converted. Sending camelCase gets you
 * `VALIDATION_ERROR: expected string, received undefined`, because the DTO
 * never sees the field it wanted.
 */

/**
 * Keys whose VALUES are opaque maps: user-authored data whose own keys carry
 * meaning and must survive untouched. The backend keeps the same set out of
 * its camelize pass, so `{"Screen size": "2.1"}` stays exactly that instead of
 * becoming `{"screenSize": "2.1"}`.
 */
const OPAQUE_KEYS = new Set(["attributes", "attributesSnap", "attributes_snap"]);

/** fooBar -> foo_bar. Runs of capitals stay together: skuID -> sku_id. */
export function snakeCase(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

/**
 * Values that must pass through by reference. Converting these would either
 * corrupt them (Date -> {}) or break the request (FormData, Blob, streams).
 */
function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  if (Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Deep-convert an outbound payload's keys to snake_case.
 *
 * Arrays are mapped elementwise. Anything that is not a plain object or array
 * — Date, FormData, File, Blob, URLSearchParams, a class instance — is
 * returned as-is rather than shallow-copied into a broken object.
 */
export function snakeizeDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((v) => snakeizeDeep(v)) as unknown as T;
  }
  if (!isPlainObject(input)) return input;

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    const nextKey = snakeCase(key);
    // An opaque map keeps BOTH its own key's conversion and its contents
    // verbatim — only the wrapper key is renamed.
    out[nextKey] = OPAQUE_KEYS.has(key) ? value : snakeizeDeep(value);
  }
  return out as T;
}
