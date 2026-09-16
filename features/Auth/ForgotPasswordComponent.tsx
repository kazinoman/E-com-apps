"use client";

import { useState, useTransition } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-with-icons";
import { ForgotPasswordFormValues, forgotPasswordSchema } from "@/schemas/auth/password-reset";
import { requestPasswordReset } from "@/server/actions/password-reset.action";

const ForgotPasswordComponent = () => {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  // The address we submitted, kept only so the confirmation step can hand it to
  // /reset-password. `null` means we are still on the form.
  const [sentTo, setSentTo] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setFormError(null);
    startTransition(async () => {
      const result = await requestPasswordReset({ email: data.email });

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      setSentTo(data.email);
    });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-lg mx-auto sm:p-8 p-10 border rounded-2xl shadow-xs">
        {sentTo ? (
          <>
            <div className="mb-8">
              <h1 className="text-[32px] font-bold text-[#82111b] mb-2 tracking-tight">Check Your Email</h1>
              {/*
                The backend answers identically whether or not the address is
                registered, so this copy must not imply an account exists.
              */}
              <p className="text-[15px] font-medium text-[#6B6565]">
                If an account exists for <span className="font-semibold text-[#292525]">{sentTo}</span>, we&apos;ve sent
                it a 6-digit reset code.
              </p>
            </div>

            <Link href={`/reset-password?email=${encodeURIComponent(sentTo)}`}>
              <Button type="button" variant="default">
                Enter Reset Code
              </Button>
            </Link>

            <div className="mt-10 text-center text-sm text-gray-500">
              Didn&apos;t get a code?{" "}
              <button
                type="button"
                onClick={() => setSentTo(null)}
                className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors ml-1"
              >
                Try another address
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-[32px] font-bold text-[#82111b] mb-2 tracking-tight">Forgot Password</h1>
              <p className="text-[15px] font-medium text-[#6B6565]">
                Enter your email address and we&apos;ll send you a code to reset your password.
              </p>
            </div>

            {formError && (
              <div className="mb-6 text-sm text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                {formError}
              </div>
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

              <Button type="submit" variant="default" disabled={isPending}>
                {isPending ? "Sending..." : "Send Reset Code"}
              </Button>
            </form>
          </>
        )}

        <div className="mt-10 text-center text-sm text-gray-500">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors ml-1"
          >
            Back to sign in
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

export default ForgotPasswordComponent;
