"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { profileService } from "@/services/profile.service";

interface ChangePhoneFlowProps {
  onBack: () => void;
  onComplete: () => void;
  currentPhone: string;
}

type Step = "REQUEST" | "VERIFY" | "UPDATE";

export function ChangePhoneFlow({ onBack, onComplete, currentPhone }: ChangePhoneFlowProps) {
  const [step, setStep] = useState<Step>("REQUEST");
  
  // Form states
  const [phoneToVerify, setPhoneToVerify] = useState(currentPhone || "+880 - 1234567890");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPhone, setNewPhone] = useState("");
  const [confirmNewPhone, setConfirmNewPhone] = useState("");
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "VERIFY" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendCode = async () => {
    try {
      setLoading(true);
      await profileService.sendPhoneOtp(phoneToVerify);
      setStep("VERIFY");
      setTimeLeft(180);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      const code = otp.join("");
      if (code.length !== 6) return;
      await profileService.verifyPhoneOtp(code);
      setStep("UPDATE");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhone = async () => {
    try {
      setLoading(true);
      if (newPhone !== confirmNewPhone || !newPhone) return;
      await profileService.updatePhoneNumber(newPhone);
      onComplete();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const getHeaderTitle = () => {
    switch (step) {
      case "REQUEST": return "Change Phone Number";
      case "VERIFY": return "Verification code";
      case "UPDATE": return "Change phone number";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={step === "REQUEST" ? onBack : () => setStep(step === "VERIFY" ? "REQUEST" : "VERIFY")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5 text-[#333333] dark:text-gray-300" strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-bold text-[#333333] dark:text-white flex-1 text-center">
          {getHeaderTitle()}
        </h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="max-w-[400px] mx-auto text-center">
        {step === "REQUEST" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Illustration */}
            <div className="h-[200px] flex items-center justify-center mb-8 relative overflow-hidden">
              <Image 
                src="/phone-request-illustration.png" 
                alt="Request Verification Code" 
                fill 
                className="object-contain" 
              />
            </div>

            <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">Change current phone number</h3>
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">Enter your phone number and verify to change phone number</p>

            <div className="text-left mb-6">
              <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
                Current phone number
              </label>
              <input
                type="text"
                value={phoneToVerify}
                onChange={(e) => setPhoneToVerify(e.target.value)}
                className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 text-[14px] text-[#8C93A3] focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                placeholder="+880 - 1234567890"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full bg-[#333333] text-white py-4 rounded-xl text-[14px] font-bold transition-transform hover:-translate-y-0.5 mb-8"
            >
              {loading ? "Sending..." : "Send verification code"}
            </button>
          </div>
        )}

        {step === "VERIFY" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             {/* Illustration */}
             <div className="h-[200px] flex items-center justify-center mb-8 relative">
              <Image 
                src="/phone-verify-illustration.png" 
                alt="Verify Phone Number" 
                fill 
                className="object-contain" 
              />
            </div>

            <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">Verify your phone number</h3>
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">We just sent a verification code to <span className="font-bold text-[#333333] dark:text-gray-300">{phoneToVerify}</span></p>

            <div className="flex justify-between items-center mb-4 text-[13px]">
              <span className="font-bold text-[#333333] dark:text-gray-300">Verification Code</span>
              <button className="font-bold text-[#333333] dark:text-gray-300 hover:text-[#4A85F6]">Re-send Code</button>
            </div>

            <div className="flex gap-2 justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-[50px] h-[55px] bg-[#F7F7FA] dark:bg-gray-800 rounded-xl text-center text-[20px] font-bold text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6] border-none"
                />
              ))}
            </div>

            <div className="flex justify-between items-center mb-8 text-[13px] font-bold">
              <span className="text-[#333333] dark:text-gray-300">Change phone number</span>
              <span className="text-[#4A85F6]">{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleVerifyCode}
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-[#333333] text-white py-4 rounded-xl text-[14px] font-bold transition-transform hover:-translate-y-0.5 mb-8 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Verifying..." : "Verify phone number"}
            </button>
          </div>
        )}

        {step === "UPDATE" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">Change phone number</h3>
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">Enter your new phone number to update</p>

            <div className="space-y-6 mb-8 text-left">
              <div>
                <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
                  New phone number
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                  placeholder="+880 - 1234567890"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
                  Confirm new phone number
                </label>
                <input
                  type="text"
                  value={confirmNewPhone}
                  onChange={(e) => setConfirmNewPhone(e.target.value)}
                  className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                  placeholder="+880 - 1234567890"
                />
              </div>
            </div>

            <button
              onClick={handleUpdatePhone}
              disabled={loading || !newPhone || newPhone !== confirmNewPhone}
              className="w-full bg-[#333333] text-white py-4 rounded-xl text-[14px] font-bold transition-transform hover:-translate-y-0.5 mb-8 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Updating..." : "Update phone number"}
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-center items-center gap-4 text-[13px] font-bold text-[#8C93A3]">
          <button onClick={onBack} className="hover:text-[#4A85F6] transition-colors">Go back</button>
          <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
          <button className="hover:text-[#4A85F6] transition-colors">Skip</button>
        </div>
      </div>
    </div>
  );
}
