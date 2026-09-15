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
