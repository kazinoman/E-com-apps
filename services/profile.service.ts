"use server";

import { profile as profileUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

/**
 * Account settings. Everything here is session-scoped — the customer comes
 * from the `buyer_session` cookie, never from an id in the path.
 */

/**
 * Step 1 of changing a phone number: send a 6-digit code to the number being
 * claimed.
 *
 * Note this takes the NEW number, not the current one. The backend has no
 * "verify my existing number" step, deliberately: proving control of the old
 * number says nothing about who is asking. What guards the change is the
 * account password at step 2.
 */
export async function requestPhoneChange(phone: string) {
  const res = await api.post(profileUrls.phone.request, { phone });
  return res.data;
}

/** Step 2: the code proves the number, `currentPassword` proves the account. */
export async function confirmPhoneChange(input: {
  phone: string;
  code: string;
  currentPassword: string;
}) {
  const res = await api.post(profileUrls.phone.confirm, input);
  return res.data;
}

/**
 * Change the account password.
 *
 * PATCH /me/password takes exactly `{current_password, new_password}` (the DTO
 * is `.strict()`, so an extra field such as a confirmation is a 400). The
 * request interceptor snake-cases these for us. The new password is capped at
 * 72 bytes because bcrypt truncates beyond that — the same rule as signup.
 */
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await api.patch(profileUrls.password, input);
  return res.data;
}

/**
 * Step 1 of changing the email: send a 6-digit code to the address being
 * claimed. Body is `{email}` only — the password is NOT taken here, so
 * "send another code" stays one click.
 */
export async function requestEmailChange(email: string) {
  const res = await api.post(profileUrls.email.request, { email });
  return res.data;
}

/**
 * Step 2: `{email, code, current_password}`.
 *
 * Same shape as the phone flow, for the same reason: the code proves control
 * of the address, but it proves nothing about who is asking, so the account
 * password re-authenticates the owner. Without it, anyone holding a live
 * session could repoint the account at an inbox they control — and sessions
 * cannot be revoked yet.
 */
export async function confirmEmailChange(input: {
  email: string;
  code: string;
  currentPassword: string;
}) {
  const res = await api.post(profileUrls.email.confirm, input);
  return res.data;
}

export async function getAddresses() {
  const res = await api.get(profileUrls.address.list);
  return res.data;
}

export async function addAddress(addressData: unknown) {
  const res = await api.post(profileUrls.address.add, addressData);
  return res.data;
}

/** PATCH, not PUT — the backend takes a partial and leaves the rest alone. */
export async function updateAddress(id: string, addressData: unknown) {
  const res = await api.patch(profileUrls.address.update(id), addressData);
  return res.data;
}

export async function deleteAddress(id: string) {
  const res = await api.delete(profileUrls.address.remove(id));
  return res.data;
}

export async function setDefaultAddress(id: string) {
  const res = await api.post(profileUrls.address.makeDefault(id));
  return res.data;
}
