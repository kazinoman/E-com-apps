/**
 * Shared shapes for the password-reset flow.
 *
 * These live here rather than beside the Server Action because a `"use server"`
 * module may only export async functions — exporting a type from it is a build
 * error.
 */

/**
 * Both password-reset endpoints answer `204 No Content`, so there is nothing to
 * carry on success. Failure carries the backend's own message
 * (`error.response.data.message`), which is the only copy we are entitled to
 * show.
 */
export type PasswordResetResult = { success: true } | { success: false; error: string };
