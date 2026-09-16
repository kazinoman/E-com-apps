"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, EyeOff, Eye, ArrowLeft, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-with-icons";
import { ResetPasswordFormValues, resetPasswordSchema } from "@/schemas/auth/password-reset";
import { confirmPasswordReset } from "@/server/actions/password-reset.action";

/**
 * The backend's reset flow is a 6-digit OTP tied to the identifier, not a
 * tokenised link — see PasswordResetConfirmDto (`email`, `code`, `new_password`).
 * So the code is typed in; `defaultEmail` is only a convenience carried over
 * from /forgot-password and stays editable.
 */
const ResetPasswordComponent = ({ defaultEmail = "" }: { defaultEmail?: string }) => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: defaultEmail,
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    setFormError(null);
    startTransition(async () => {
      const result = await confirmPasswordReset({
        email: data.email,
        code: data.code,
        newPassword: data.newPassword,
      });

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      router.push("/login");
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-lg mx-auto sm:p-8 p-10 border rounded-2xl shadow-xs">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#82111b] mb-2 tracking-tight">Reset Password</h1>
          <p className="text-[15px] font-medium text-[#6B6565]">
            Enter the 6-digit code from your email and choose a new password.
          </p>
        </div>

        {formError && (
          <div className="mb-6 text-sm text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-xl">{formError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            icon={<Mail size={16} />}
            type="email"
            placeholder="you@example.com"
            className="py-5"
            label="Email Address"
            {...register("email")}
            error={errors.email?.message}
          />

          <InputField
            icon={<KeyRound size={16} />}
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="123456"
            className="py-5"
            label="Reset Code"
            {...register("code")}
            error={errors.code?.message}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 ml-1">New Password</label>
            <div className="relative">
              <InputField
                icon={<Lock size={16} />}
                {...register("newPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="........"
                className="py-5"
                error={errors.newPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-5.5 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <InputField
            icon={<Lock size={16} />}
            type={showPassword ? "text" : "password"}
            placeholder="........"
            className="py-5"
            label="Confirm New Password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" variant="default" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500">
          Need a new code?{" "}
          <Link
            href="/forgot-password"
            className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors ml-1"
          >
            Request another
          </Link>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordComponent;
