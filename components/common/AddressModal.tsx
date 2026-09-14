"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (addressData: any) => Promise<void>;
  initialData?: any;
}

export function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    street: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          name: "",
          country: "",
          state: "",
          city: "",
          zip: "",
          street: "",
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(formData);
      toast.success(initialData ? "Address updated successfully" : "Address added successfully");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-[450px] max-h-[90vh] overflow-y-auto relative scrollbar-hide">
        {/* Header */}
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
            {/* Address Name */}
            <div>
              <label className="block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2">
                Address name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                placeholder="e.g. Home"
              />
            </div>

            {/* Country & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                  placeholder="e.g. United States"
                />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2">
                  State/District
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                  placeholder="e.g. California"
                />
              </div>
            </div>

            {/* City & ZIP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2">
                  City/Area
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                  placeholder="e.g. Los Angeles"
                />
              </div>
              <div>
                <label className="block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                />
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-[14px] font-semibold text-[#333333] dark:text-gray-300 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                placeholder="e.g. Road no., Building no., Floor no. etc"
              />
            </div>
            
            <hr className="border-gray-100 dark:border-gray-800 my-6" />

            <button
              onClick={handleSubmit}
              disabled={loading || !formData.name || !formData.state || !formData.city || !formData.zip || !formData.street || !formData.country}
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
