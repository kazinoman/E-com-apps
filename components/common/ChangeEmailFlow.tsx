"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { requestEmailChange, confirmEmailChange } from "@/services/profile.service";
import { toast } from "sonner";

interface ChangeEmailFlowProps {
  onBack: () => void;
  onComplete: (email: string) => void;
  currentEmail: string;
}

/*
 * Two steps, mirroring the phone flow exactly, because the endpoints do:
 * `POST /me/email/request` takes `{email}` alone, and
 * `POST /me/email/confirm` takes `{email, code, current_password}`.
 *
 * The password IS required at confirm, and for the same reason it is on the
 * phone: the emailed code proves control of the address being claimed, not
 * that the person claiming it owns this account. Sessions cannot be revoked
 * yet, so leaving it out would turn a live session into an account takeover.
 * It is checked at confirm rather than request so "re-send code" stays one
 * click.
 */
type Step = "REQUEST" | "VERIFY";

export function ChangeEmailFlow({ onBack, onComplete, currentEmail }: ChangeEmailFlowProps) {
  const [step, setStep] = useState<Step>("REQUEST");

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [currentPassword, setCurrentPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "VERIFY" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
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
    if (!newEmail) return;
    try {
      setLoading(true);
      await requestEmailChange(newEmail.trim());
      setStep("VERIFY");
      setTimeLeft(180);
    } catch (error) {
      toast.error(message(error, "Could not send the code. Check the address and try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    const code = otp.join("");
    if (code.length !== 6 || !currentPassword) return;
    try {
      setLoading(true);
      await confirmEmailChange({ email: newEmail.trim(), code, currentPassword });
      toast.success("Email address updated");
      onComplete(newEmail.trim());
    } catch (error) {
      toast.error(message(error, "That code or password was not accepted."));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`email-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`email-otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={step === "REQUEST" ? onBack : () => setStep("REQUEST")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#333333] dark:text-gray-300" strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-bold text-[#333333] dark:text-white flex-1 text-center">
          {step === "REQUEST" ? "Change Email Address" : "Verification code"}
        </h1>
        <div className="w-9" />
      </div>

      <div className="max-w-[400px] mx-auto text-center">
        {step === "REQUEST" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">
              Change your email address
            </h3>
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">
              We&apos;ll email a code to the new address to confirm it&apos;s yours.
              {currentEmail ? ` Your current address is ${currentEmail}.` : ""}
            </p>

            <div className="text-left mb-6">
              <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
                New email address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
                maxLength={254}
                className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
                placeholder="you@example.com"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading || !newEmail.trim()}
              className="w-full bg-[#333333] text-white py-4 rounded-xl text-[14px] font-bold transition-transform hover:-translate-y-0.5 mb-8 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Sending..." : "Send verification code"}
            </button>
          </div>
        )}

        {step === "VERIFY" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">
              Verify your email address
            </h3>
            <p className="text-[13px] text-[#8C93A3] mb-8 text-left">
              We just sent a verification code to{" "}
              <span className="font-bold text-[#333333] dark:text-gray-300">{newEmail}</span>
            </p>

            <div className="flex justify-between items-center mb-4 text-[13px]">
              <span className="font-bold text-[#333333] dark:text-gray-300">Verification Code</span>
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="font-bold text-[#333333] dark:text-gray-300 hover:text-[#4A85F6] disabled:opacity-50"
              >
                Re-send Code
              </button>
            </div>

            <div className="flex gap-2 justify-between mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`email-otp-${index}`}
                  type="text"
                  inputMode="numeric"
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
              The code proves the address; the password proves the account.
              Without it, anyone holding a live session could repoint the
              account at an inbox they control.
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
              {loading ? "Updating..." : "Update email address"}
            </button>
          </div>
        )}

        <div className="flex justify-center items-center gap-4 text-[13px] font-bold text-[#8C93A3]">
          <button onClick={onBack} className="hover:text-[#4A85F6] transition-colors">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
