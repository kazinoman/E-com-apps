"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, EyeOff, Eye, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-with-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormValues, loginSchema } from "@/schemas/auth/signIn-and-signup";
import { login } from "@/server/actions/login.action";
import { useAuth } from "@/contexts/UserInfoContext";

const LoginComponent = () => {
  const router = useRouter();

  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    startTransition(async () => {
      delete data.remember;

      const result = await login(data);
      setUser(result.data);

      if (!result.success) {
        return;
      }

      router.push("/");
    });
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="w-full max-w-lg mx-auto sm:p-8 p-10 border rounded-2xl shadow-xs">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#82111b] mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-[15px] font-medium text-[#6B6565]">Please sign in to access your Luxe account.</p>
        </div>

        {/* {state?.message && (
        <div className="mb-6 text-sm text-rose-800 bg-rose-50 border border-rose-200 p-3 rounded-xl">
          {state.message}
        </div>
      )} */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            icon={<Mail size={16} />}
            type="email"
            placeholder="you@example.com"
            className="py-5"
            label="Email Address"
            {...register("email")}
            error={errors.email && errors.email.message}
          />
          {/* {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>} */}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1 mb-1.5">
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <Link
                href="/forget-password"
                className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline transition-all"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <InputField
                icon={<Lock size={16} />}
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="........"
                className="py-5"
                error={errors.password && errors.password.message}
              />
              {/* {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>} */}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-5.5 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center ml-1 py-1">
            <Checkbox
              checked={watch("remember")}
              onCheckedChange={(checked) => setValue("remember", Boolean(checked))}
            />
            <label htmlFor="remember" className="ml-2.5 text-sm text-gray-600 font-medium cursor-pointer select-none">
              Keep me signed in
            </label>
          </div>

          <Button
            type="submit"
            variant="default"
            // disabled={isPending}
            // className="w-full bg-[#7E1A20] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#681419] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#7E1A20] disabled:opacity-80 disabled:cursor-not-allowed mt-2 shadow-sm"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-[#D6D0CF]"></div>
          <span className="px-4 text-[13px] font-medium text-[#6B6565]">Or continue with</span>
          <div className="flex-1 border-t border-[#D6D0CF]"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="w-full flex items-center justify-center gap-2.5 border border-[#D6D0CF] bg-transparent rounded-lg py-2.5 text-[14px] font-semibold text-[#292525] hover:bg-[#F2EDEC] hover:border-[#C4BDBA] transition-all">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          <button className="w-full flex items-center justify-center gap-2.5 border border-[#D6D0CF] bg-transparent rounded-lg py-2.5 text-[14px] font-semibold text-[#292525] hover:bg-[#F2EDEC] hover:border-[#C4BDBA] transition-all">
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook
          </button>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-primary hover:text-primary-hover hover:underline transition-colors ml-1"
          >
            Sign up now
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

export default LoginComponent;
