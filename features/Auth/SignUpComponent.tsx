"use client";

import { useState, useTransition } from "react";
import { Mail, Lock, EyeOff, Eye, ArrowLeft, User, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { signupSchema } from "@/schemas/auth/signIn-and-signup";
import { useAuth } from "@/contexts/UserInfoContext";
import { signup } from "@/server/actions/signup.action";
import { z } from "zod";

const formSchema = signupSchema.extend({
  confirmPassword: z.string().min(1, "Please confirm your password"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LocalSignupFormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocalSignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = (data: LocalSignupFormValues) => {
    startTransition(async () => {
      // Exclude frontend-only fields
      const { confirmPassword, terms, ...submitData } = data;
      const result = await signup(submitData);

      if (!result.success) {
        toast.error(result.error || "An error occurred during signup");
        return;
      }

      toast.success("Account created successfully!");
      setUser(result.data);
      router.push("/login");
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-background font-sans p-4 py-8">
      <div className="w-full max-w-125 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sm:p-8 relative flex flex-col items-center">
        
        <div className="w-full">
          <h2 className="text-[20px] font-bold text-[#333333] dark:text-white mb-8 text-center">Sign up</h2>
          
          <h3 className="text-[22px] font-bold text-[#333333] dark:text-white mb-2">Sign up</h3>
          <p className="text-[14px] text-[#8C93A3] mb-6 leading-relaxed">
            Please fill up the form to sign up!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Full name</label>
              <input 
                type="text" 
                placeholder="username" 
                className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
                {...register("full_name")}
              />
              {errors.full_name && <p className="text-xs text-red-500 mt-1.5">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Email address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Phone number</label>
              <input 
                type="text" 
                placeholder="+880 - 1234567890" 
                className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
                {...register("phone")}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1.5">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters" 
                  className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 pr-12 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
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

            <div>
              <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Confirm password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Min. 8 characters" 
                  className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 pr-12 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start pt-2">
              <Checkbox
                checked={watch("terms")}
                onCheckedChange={(checked) => setValue("terms", Boolean(checked), { shouldValidate: true })}
                className="mt-0.5 border-gray-300 data-[state=checked]:bg-[#333333] data-[state=checked]:text-white dark:border-gray-600 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-[#333333]"
                id="terms"
              />
              <div className="ml-2.5">
                <label htmlFor="terms" className="text-[13px] text-[#8C93A3] font-medium cursor-pointer select-none leading-tight">
                  By signing up, you agree to our <span className="text-[#333333] dark:text-white font-bold">Terms & conditions</span>
                </label>
                {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#333333] dark:bg-white text-white dark:text-[#333333] py-4 rounded-xl text-[15px] font-bold mt-2 shadow-sm hover:bg-black dark:hover:bg-gray-200 transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing Up..." : "Sign up"}
            </button>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#8C93A3]">
            Already have an account ?{" "}
            <Link
              href="/login"
              className="font-bold text-[#333333] dark:text-white hover:underline transition-colors"
            >
              Sign in
            </Link>
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

export default SignUpForm;
