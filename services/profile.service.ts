"use server";

import { profile as profileUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";

export async function sendPhoneOtp(phone: string) {
  const res = await api.post(profileUrls.phone.otp, { phone });
  return res.data;
}

export async function verifyPhoneOtp(code: string) {
  const res = await api.post(profileUrls.phone.verify, { code });
  return res.data;
}

export async function updatePhoneNumber(newPhone: string) {
  const res = await api.post(profileUrls.phone.update, { newPhone });
  return res.data;
}

export async function getAddresses() {
  const res = await api.get(profileUrls.address.list);
  return res.data;
}

export async function addAddress(addressData: any) {
  const res = await api.post(profileUrls.address.add, addressData);
  return res.data;
}

export async function updateAddress(id: string, addressData: any) {
  const res = await api.put(profileUrls.address.update(id), addressData);
  return res.data;
}

export async function deleteAddress(id: string) {
  const res = await api.delete(profileUrls.address.remove(id));
  return res.data;
}
