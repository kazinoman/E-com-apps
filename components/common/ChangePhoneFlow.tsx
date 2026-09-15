"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { requestPhoneChange, confirmPhoneChange } from "@/services/profile.service";
import { toast } from "sonner";

interface ChangePhoneFlowProps {
  onBack: () => void;
  onComplete: () => void;
  currentPhone: string;
}

/*
 * Two steps, because that is what the backend offers: request a code for the
 * NEW number, then confirm it with the account password. The old three-step
 * flow (verify the current number, then set a new one) was written against a
 * mock; it has no endpoints behind it and it guarded nothing — holding the old
 * SIM does not prove you own the account.
 */
type Step = "REQUEST" | "VERIFY";

export function ChangePhoneFlow({ onBack, onComplete, currentPhone }: ChangePhoneFlowProps) {
  const [step, setStep] = useState<Step>("REQUEST");
  
  // Form states
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentPassword, setCurrentPassword] = useState("");
  
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

  const message = (error: unknown, fallback: string) =>
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;

  const handleSendCode = async () => {
    if (!newPhone) return;
    try {
      setLoading(true);
      await requestPhoneChange(newPhone);
      setStep("VERIFY");
      setTimeLeft(180);
    } catch (error) {
      toast.error(message(error, "Could not send the code. Check the number and try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length !== 6 || !currentPassword) return;
    try {
      setLoading(true);
      await confirmPhoneChange({ phone: newPhone, code, currentPassword });
      toast.success("Phone number updated");
      onComplete();
    } catch (error) {
      toast.error(message(error, "That code or password was not accepted."));
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
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={step === "REQUEST" ? onBack : () => setStep("REQUEST")} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
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

            <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">Change your phone number</h3>
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">
              We&apos;ll text a code to the new number to confirm it&apos;s yours.
              {currentPhone ? ` Your current number is ${currentPhone}.` : ""}
            </p>

            <div className="text-left mb-6">
              <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
                New phone number
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading || !newPhone}
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
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">We just sent a verification code to <span className="font-bold text-[#333333] dark:text-gray-300">{newPhone}</span></p>

            <div className="flex justify-between items-center mb-4 text-[13px]">
              <span className="font-bold text-[#333333] dark:text-gray-300">Verification Code</span>
              <button onClick={handleSendCode} disabled={loading} className="font-bold text-[#333333] dark:text-gray-300 hover:text-[#4A85F6] disabled:opacity-50">Re-send Code</button>
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

            <div className="flex justify-between items-center mb-6 text-[13px] font-bold">
              <span className="text-[#333333] dark:text-gray-300">Code expires in</span>
              <span className="text-[#4A85F6]">{formatTime(timeLeft)}</span>
            </div>

            {/*
              The code proves the new number; the password proves the account.
              Without it, anyone holding a live session could repoint the
              account at a number they control.
            */}
            <div className="text-left mb-8">
              <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
                Your account password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading || otp.join("").length !== 6 || !currentPassword}
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
