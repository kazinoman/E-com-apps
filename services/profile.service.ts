export const profileService = {
  sendPhoneOtp: async (phone: string) => {
    const res = await fetch("/api/profile/phone/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) throw new Error("Failed to send OTP");
    return res.json();
  },

  verifyPhoneOtp: async (code: string) => {
    const res = await fetch("/api/profile/phone/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw new Error("Failed to verify OTP");
    return res.json();
  },

  updatePhoneNumber: async (newPhone: string) => {
    const res = await fetch("/api/profile/phone/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPhone }),
    });
    if (!res.ok) throw new Error("Failed to update phone number");
    return res.json();
  },

  getAddresses: async () => {
    const res = await fetch("/api/profile/address");
    if (!res.ok) throw new Error("Failed to fetch addresses");
    return res.json();
  },

  addAddress: async (addressData: any) => {
    const res = await fetch("/api/profile/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    });
    if (!res.ok) throw new Error("Failed to add address");
    return res.json();
  },

  updateAddress: async (id: string, addressData: any) => {
    const res = await fetch(`/api/profile/address/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addressData),
    });
    if (!res.ok) throw new Error("Failed to update address");
    return res.json();
  },

  deleteAddress: async (id: string) => {
    const res = await fetch(`/api/profile/address/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete address");
    return res.json();
  }
};
