"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

/**
 * The fields are the backend's `AddressInput`, not a generic postal form: a
 * recipient and a Bangladeshi phone number are required (that is who the
 * courier calls), country is not a field at all, and `area` and `district` are
 * separate from `city` because that is how a BD address is actually given.
 */
export interface AddressFormValues {
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  area: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

const EMPTY: AddressFormValues = {
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  area: "",
  city: "",
  district: "",
  postalCode: "",
  isDefault: false,
};

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: AddressFormValues) => Promise<void>;
  initialData?: Partial<AddressFormValues> | null;
}

/** What the backend accepts: 11 digits starting 01. */
const PHONE_RE = /^01\d{9}$/;

const field =
  "w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]";
const labelClass = "block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2";

export function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormValues>(EMPTY);

  useEffect(() => {
    if (!isOpen) return;
    setFormData(initialData ? { ...EMPTY, ...initialData } : EMPTY);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const set = (key: keyof AddressFormValues) => (value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const phoneValid = PHONE_RE.test(formData.phone);
  const complete =
    formData.recipientName.trim() &&
    phoneValid &&
    formData.line1.trim() &&
    formData.area.trim() &&
    formData.city.trim() &&
    formData.district.trim();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      toast.success(initialData ? "Address updated successfully" : "Address added successfully");
      onClose();
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message ?? "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-[450px] max-h-[90vh] overflow-y-auto relative scrollbar-hide">
        <div className="p-6 pb-4 text-center border-b border-gray-100 dark:border-gray-800 relative">
          <h2 className="text-[17px] font-bold text-[#333333] dark:text-white">
            {initialData ? "Edit Address" : "New Address"}
          </h2>
          <button
            onClick={onClose}
            className="absolute top-6 right-5 text-[#333333] hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8 pt-6">
          <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-6 text-left">
            {initialData ? "Update address details" : "Create new address"}
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Recipient name</label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => set("recipientName")(e.target.value)}
                  className={field}
                  placeholder="Who receives the parcel"
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  className={field}
                  placeholder="01XXXXXXXXX"
                />
                {formData.phone && !phoneValid && (
                  <p className="text-[12px] text-[#FF5C5C] mt-1">Enter an 11-digit number starting 01.</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass}>
                Address label <span className="font-normal text-[#8C93A3]">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => set("label")(e.target.value)}
                className={field}
                placeholder="e.g. Home"
              />
            </div>

            <div>
              <label className={labelClass}>Street address</label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => set("line1")(e.target.value)}
                className={field}
                placeholder="House / road no., building"
              />
            </div>

            <div>
              <label className={labelClass}>
                Apartment, floor <span className="font-normal text-[#8C93A3]">(optional)</span>
              </label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => set("line2")(e.target.value)}
                className={field}
                placeholder="Flat 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Area</label>
                <input
                  type="text"
                  value={formData.area}
                  onChange={(e) => set("area")(e.target.value)}
                  className={field}
                  placeholder="e.g. Dhanmondi"
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => set("city")(e.target.value)}
                  className={field}
                  placeholder="e.g. Dhaka"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => set("district")(e.target.value)}
                  className={field}
                  placeholder="e.g. Dhaka"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Postal code <span className="font-normal text-[#8C93A3]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => set("postalCode")(e.target.value)}
                  className={field}
                  placeholder="1209"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 text-[14px] text-[#333333] dark:text-gray-300">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => set("isDefault")(e.target.checked)}
                className="w-4 h-4"
              />
              Use this as my default delivery address
            </label>

            <hr className="border-gray-100 dark:border-gray-800 my-6" />

            <button
              onClick={handleSubmit}
              disabled={loading || !complete}
              className="w-full bg-[#333333] text-white py-4 rounded-lg text-[15px] font-bold transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
