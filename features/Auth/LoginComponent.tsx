"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, EyeOff, Eye, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/input-with-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { LoginFormValues, loginSchema } from "@/schemas/auth/signIn-and-signup";
import { login } from "@/server/actions/login.action";
import { useAuth } from "@/contexts/UserInfoContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const LoginComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || searchParams.get("next") || "/";

  const { setUser } = useAuth();
  const { refresh: refreshWishlist } = useWishlist();
  const { refresh: refreshCart } = useCart();
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

      try {
        const result = await login(data);

        if (!result.success) {
          toast.error(result.message || "Invalid credentials. Please try again.");
          return;
        }

        toast.success("Successfully signed in!");
        setUser(result.data);

        // Refresh server states now that we have a user session
        await Promise.all([
          refreshWishlist(),
          refreshCart()
        ]);

        router.push(redirectUrl);
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again later.");
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-background font-sans p-4 py-8">
      <div className="w-full max-w-125 bg-card rounded-3xl shadow-sm border border-border p-6 sm:p-8 relative flex flex-col items-center">
        <div className="flex justify-center mb-6 w-full ">
          <Image
            src="/Tablet_login.gif"
            alt="Sign In Illustration"
            width={500}
            height={150}
            className="w-full object-contain !h-[200px]"
            priority
            unoptimized
          />
        </div>

        <div className="w-full">
          <h2 className="text-[22px] font-bold text-foreground mb-2">Sign In</h2>
          <p className="text-[14px] text-[#8C93A3] mb-6 leading-relaxed">
            Enter your phone number and password to sign in!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Phone number</label>
              <input
                type="text"
                placeholder="+880 - 1234567890"
                className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 text-[14px] outline-none text-foreground transition-all placeholder:text-[#8C93A3]"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 pr-12 text-[14px] outline-none text-foreground transition-all placeholder:text-[#8C93A3]"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <Checkbox
                  checked={watch("remember")}
                  onCheckedChange={(checked) => setValue("remember", Boolean(checked))}
                  className="border-gray-300 data-[state=checked]:bg-[#333333] data-[state=checked]:text-white dark:border-gray-600 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-[#333333]"
                  id="remember"
                />
                <label htmlFor="remember" className="ml-2.5 text-[13px] text-[#333333] dark:text-gray-300 font-medium cursor-pointer select-none">
                  Keep me logged in
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-[13px] font-bold text-foreground hover:underline transition-all"
              >
                Forget password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#333333] dark:bg-white text-white dark:text-[#333333] py-4 rounded-xl text-[15px] font-bold mt-2 shadow-sm hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#8C93A3]">
            Don't have an account ?{" "}
            <Link
              href="/signup"
              className="font-bold text-foreground hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-4 text-[13px] font-medium text-[#8C93A3]">Or continue with</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="w-full flex items-center justify-center gap-2.5 border border-border bg-transparent rounded-lg py-2.5 text-[14px] font-semibold text-[#333333] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
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

            <button className="w-full flex items-center justify-center gap-2.5 border border-border bg-transparent rounded-lg py-2.5 text-[14px] font-semibold text-[#333333] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path
                  fill="#1877F2"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[14px] font-medium text-[#8C93A3] hover:text-[#333333] dark:hover:text-white transition-colors"
            >
              Skip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
