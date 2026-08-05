"use client";

import { useSearchParams, useNavigate } from "react-router";
import { Lock, Loader2, ArrowRight } from "lucide-react";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLink, useUpdatePassword } from "@refinedev/core";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
  const Link = useLink();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: updatePassword, isPending: isUpdating } = useUpdatePassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Reset token is missing or invalid.", { richColors: true });
      return;
    }

    updatePassword(
      {
        password: values.password,
        token,
      },
      {
        onSuccess: (data) => {
          if (data.success === false) {
            toast.error(data.error?.message || "Failed to reset password", {
              richColors: true,
            });
            return;
          }
          toast.success("Your password has been successfully reset!", {
            richColors: true,
          });
          navigate("/login");
        },
        onError: (error) => {
          toast.error(error?.message || "Password reset failed. Please try again.", {
            richColors: true,
          });
        },
      }
    );
  };

  return (
    <div
      className={cn(
        "reset-password",
        "relative",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-12",
        "min-h-svh",
        "bg-[#f8fafc] dark:bg-zinc-950",
        "overflow-hidden"
      )}
    >
      {/* Background patterns */}
      <div className="absolute top-10 right-10 w-44 h-44 opacity-25 dark:opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <Card
        className={cn(
          "card",
          "relative z-10",
          "sm:w-[480px] w-full",
          "p-10 sm:p-12",
          "rounded-3xl",
          "border border-slate-100 dark:border-zinc-900/80",
          "bg-white/95 dark:bg-zinc-950/80",
          "shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]",
          "backdrop-blur-xl",
          "transition-all duration-500"
        )}
      >
        <CardHeader className="header text-center space-y-2 pb-6 px-0 pt-0">
          <CardTitle className="title text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reset Password
          </CardTitle>
          <CardDescription className="description text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
            Enter your new password below
          </CardDescription>
        </CardHeader>

        <CardContent className="content p-0">
          {!token ? (
            <div className="text-center py-6 text-red-500 font-medium">
              Invalid or missing password reset token. Please request a new reset link.
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleResetPassword)}
                className="form space-y-5"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="field space-y-2 text-left">
                      <FormLabel
                        htmlFor="password"
                        className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide"
                      >
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                          <InputPassword
                            id="password"
                            required
                            placeholder="••••••••"
                            className="pl-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="field space-y-2 text-left">
                      <FormLabel
                        htmlFor="confirmPassword"
                        className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide"
                      >
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative flex items-center">
                          <Lock className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                          <InputPassword
                            id="confirmPassword"
                            required
                            placeholder="••••••••"
                            className="pl-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white transition-all duration-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="submit w-full h-12 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-primary/25 dark:shadow-primary/10 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter className="footer p-0 flex justify-center mt-6">
          <Link
            to="/login"
            className="text-sm text-primary hover:text-primary/90 font-bold hover:underline transition-colors cursor-pointer"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

ResetPasswordForm.displayName = "ResetPasswordForm";
