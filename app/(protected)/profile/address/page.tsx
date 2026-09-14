"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { AddressModal } from "@/components/common/AddressModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { profileService } from "@/services/profile.service";
import { toast } from "sonner";

export default function AddressPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await profileService.getAddresses();
      if (res.success) {
        setAddresses(res.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSaveAddress = async (addressData: any) => {
    if (editingAddress) {
      const res = await profileService.updateAddress(editingAddress.id, addressData);
      if (res.success) {
        setAddresses(addresses.map(a => a.id === editingAddress.id ? res.data : a));
      }
    } else {
      const res = await profileService.addAddress(addressData);
      if (res.success) {
        setAddresses([...addresses, res.data]);
      }
    }
    setEditingAddress(null);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    
    try {
      const res = await profileService.deleteAddress(deleteConfirmId);
      if (res.success) {
        setAddresses(addresses.filter(a => a.id !== deleteConfirmId));
        toast.success("Address deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 w-full min-h-full p-8 relative">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-[14px] font-medium text-[#8C93A3]">
          Choose default address
        </h2>
        <button 
          onClick={() => {
            setEditingAddress(null);
            setIsModalOpen(true);
          }}
          className="bg-[#333333] hover:bg-black text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-colors"
        >
          Add new address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No addresses found. Add one above.</div>
        ) : (
          addresses.map((address) => (
            <div 
              key={address.id} 
              className={`flex items-center justify-between p-6 rounded-xl border-[2px] transition-colors ${
                address.isDefault 
                  ? "border-[#333333] bg-[#F7F7FA] dark:bg-gray-800" 
                  : "border-[#F7F7FA] dark:border-gray-800 bg-[#F7F7FA] dark:bg-gray-800"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Radio Circle */}
                <div className="mt-1 relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#8C93A3] shrink-0">
                  {address.isDefault && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#333333]"></div>
                  )}
                </div>
                
                {/* Address Details */}
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[15px] font-bold text-[#333333] dark:text-white">
                      {address.name}
                    </span>
                    {address.isDefault && (
                      <span className="bg-[#EBEBEF] dark:bg-gray-700 text-[#8C93A3] text-[11px] font-bold px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#8C93A3] font-medium leading-relaxed">
                    {address.street}, {address.city}, {address.state}, {address.zip}.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-6 ml-4">
                <button 
                  onClick={() => handleEdit(address)}
                  className="text-[#8C93A3] hover:text-[#333333] dark:hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setDeleteConfirmId(address.id)}
                  className="text-[#8C93A3] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddressModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        initialData={editingAddress}
      />
      
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteConfirmId(null)}
      />
    </div>
  );
}
