"use client";

import { useState } from "react";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { changePassword } from "@/services/profile.service";
import { toast } from "sonner";

interface ChangePasswordFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

/*
 * One step, because that is the whole endpoint: PATCH /me/password takes
 * `{current_password, new_password}` and nothing else — the DTO is strict, so
 * the confirmation field below is checked here and never sent.
 *
 * The 8-character floor and the 72-byte ceiling are the backend's own rules
 * (bcrypt truncates past 72 bytes), mirrored here so the shopper is told
 * before a round-trip rather than by a 400.
 */
const MIN_LENGTH = 8;
const MAX_BYTES = 72;

export function ChangePasswordFlow({ onBack, onComplete }: ChangePasswordFlowProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const tooLong = new TextEncoder().encode(newPassword).length > MAX_BYTES;
  const tooShort = newPassword.length > 0 && newPassword.length < MIN_LENGTH;
  const mismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  const ready =
    currentPassword.length > 0 &&
    newPassword.length >= MIN_LENGTH &&
    !tooLong &&
    confirmPassword === newPassword;

  const message = (error: unknown, fallback: string) =>
    (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback;

  const handleSubmit = async () => {
    if (!ready) return;
    try {
      setLoading(true);
      // Only the two fields the DTO accepts; the interceptor snake-cases them.
      await changePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      onComplete();
    } catch (error) {
      toast.error(message(error, "That password was not accepted."));
    } finally {
      setLoading(false);
    }
  };

  const field = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    autoComplete: string,
    hint?: string | null,
  ) => (
    <div className="text-left mb-6">
      <label className="block text-[13px] font-bold text-[#333333] dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="w-full bg-[#F7F7FA] dark:bg-gray-800 border-none rounded-xl p-4 pr-12 text-[14px] text-[#333333] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4A85F6]"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide passwords" : "Show passwords"}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8C93A3] hover:text-[#333333] dark:hover:text-white transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {hint ? <p className="mt-2 text-[12px] font-medium text-[#E94B4B]">{hint}</p> : null}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 w-full min-h-full">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#333333] dark:text-gray-300" strokeWidth={2.5} />
        </button>
        <h1 className="text-[18px] font-bold text-[#333333] dark:text-white flex-1 text-center">
          Change Password
        </h1>
        <div className="w-9" />
      </div>

      <div className="max-w-[400px] mx-auto">
        <h3 className="text-[20px] font-bold text-[#333333] dark:text-white mb-2 text-left">
          Set a new password
        </h3>
        <p className="text-[13px] text-[#8C93A3] mb-8 text-left">
          Your current password confirms it is you. The new one must be at least {MIN_LENGTH}{" "}
          characters.
        </p>

        {field("Current password", currentPassword, setCurrentPassword, "current-password")}
        {field(
          "New password",
          newPassword,
          setNewPassword,
          "new-password",
          tooShort
            ? `Use at least ${MIN_LENGTH} characters.`
            : tooLong
              ? `That is longer than ${MAX_BYTES} bytes, which is the most the account can store.`
              : null,
        )}
        {field(
          "Confirm new password",
          confirmPassword,
          setConfirmPassword,
          "new-password",
          mismatch ? "The two passwords do not match." : null,
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !ready}
          className="w-full bg-[#333333] text-white py-4 rounded-xl text-[14px] font-bold transition-transform hover:-translate-y-0.5 mb-8 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {loading ? "Updating..." : "Update password"}
        </button>

        <div className="flex justify-center items-center gap-4 text-[13px] font-bold text-[#8C93A3]">
          <button onClick={onBack} className="hover:text-[#4A85F6] transition-colors">
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
