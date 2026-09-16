"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/UserInfoContext";
import { Edit2, Camera } from "lucide-react";
import { ChangePhoneFlow } from "@/components/common/ChangePhoneFlow";
import { ChangeEmailFlow } from "@/components/common/ChangeEmailFlow";
import { ChangePasswordFlow } from "@/components/common/ChangePasswordFlow";

/** Which account-security flow has taken over the panel, if any. */
type Flow = "PHONE" | "EMAIL" | "PASSWORD" | null;

export default function MyProfilePage() {
  const { user, setUser } = useAuth();

  const [flow, setFlow] = useState<Flow>(null);
  /*
   * Seeded from the session, with no placeholder identity behind it: an
   * account with no phone on file renders an empty field, because inventing
   * "+880 - 1234567890" is inventing account data.
   */
  const [formData, setFormData] = useState({
    fullName: user?.fullName ?? "",
    phone: user?.phone ?? "",
    email: user?.email ?? "",
  });

  const closeFlow = () => setFlow(null);

  if (flow === "PHONE") {
    return (
      <ChangePhoneFlow
        currentPhone={formData.phone}
        onBack={closeFlow}
        onComplete={closeFlow}
      />
    );
  }

  if (flow === "EMAIL") {
    return (
      <ChangeEmailFlow
        currentEmail={formData.email}
        onBack={closeFlow}
        onComplete={(email) => {
          // The address really did change server-side, so the local view of
          // the session is corrected rather than left stale until a reload.
          setFormData({ ...formData, email });
          if (user) setUser({ ...user, email });
          closeFlow();
        }}
      />
    );
  }

  if (flow === "PASSWORD") {
    return <ChangePasswordFlow onBack={closeFlow} onComplete={closeFlow} />;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 w-full min-h-full flex flex-col items-center p-8">
      
      {/* Avatar Section */}
      <div className="relative mb-12 mt-4">
        <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-[#FCDDB0]">
          <Image 
            src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} 
            alt="Profile Avatar" 
            width={100} 
            height={100} 
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#8C93A3] text-white rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 hover:bg-[#727a8c] transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="w-full max-w-[500px] space-y-6">
        
        {/* Full Name */}
        <div>
          <label className="block text-[13px] font-bold text-[#8C93A3] mb-2">
            Full name
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 pr-12 text-[14px] font-medium text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C93A3] hover:text-[#333333] dark:hover:text-white transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-[13px] font-bold text-[#8C93A3] mb-2">
            Phone number
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.phone}
              disabled
              className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 pr-12 text-[14px] font-medium text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6] cursor-not-allowed"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setFlow("PHONE");
              }}
              aria-label="Change phone number"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C93A3] hover:text-[#333333] dark:hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-[13px] font-bold text-[#8C93A3] mb-2">
            Email
          </label>
          <div className="relative">
            {/* Read-only: an email change is a verified two-step flow, not a
                free-text edit, so this field never writes on its own. */}
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 pr-12 text-[14px] font-medium text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6] cursor-not-allowed"
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setFlow("EMAIL");
              }}
              aria-label="Change email address"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C93A3] hover:text-[#333333] dark:hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/*
          No password field: there is nothing to show. The old one rendered a
          literal string of bullets as if it were the stored secret and could
          be typed over with no endpoint behind it. Changing it is a flow.
        */}

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              setFlow("PHONE");
            }}
            className="w-full bg-[#F7F7FA] dark:bg-gray-800 hover:bg-[#EBEBEF] dark:hover:bg-gray-700 text-[#333333] dark:text-white py-4 rounded-xl text-[14px] font-bold transition-colors"
          >
            Change Phone number
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setFlow("EMAIL");
            }}
            className="w-full bg-[#F7F7FA] dark:bg-gray-800 hover:bg-[#EBEBEF] dark:hover:bg-gray-700 text-[#333333] dark:text-white py-4 rounded-xl text-[14px] font-bold transition-colors"
          >
            Change Email address
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setFlow("PASSWORD");
            }}
            className="w-full bg-[#F7F7FA] dark:bg-gray-800 hover:bg-[#EBEBEF] dark:hover:bg-gray-700 text-[#333333] dark:text-white py-4 rounded-xl text-[14px] font-bold transition-colors"
          >
            Change Password
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-8">
          <button className="flex-1 border border-gray-200 dark:border-gray-700 text-[#E94B4B] py-4 rounded-xl text-[14px] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button className="flex-1 border border-gray-200 dark:border-gray-700 text-[#4A85F6] py-4 rounded-xl text-[14px] font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
