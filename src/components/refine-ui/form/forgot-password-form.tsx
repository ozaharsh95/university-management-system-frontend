"use client";

import { ArrowLeft, Mail, Loader2, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForgotPassword, useLink } from "@refinedev/core";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const Link = useLink();
  const { mutate: forgotPassword, isPending: isSending } = useForgotPassword();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
    forgotPassword(
      {
        email: values.email,
      },
      {
        onSuccess: (data) => {
          if (data.success === false) {
            toast.error(data.error?.message || "Failed to submit request", {
              richColors: true,
            });
            return;
          }
          toast.success("Password reset email sent! Check your inbox.", {
            richColors: true,
          });
          form.reset();
        },
        onError: (error) => {
          toast.error(error?.message || "Something went wrong. Please try again.", {
            richColors: true,
          });
        },
      }
    );
  };

  return (
    <div
      className={cn(
        "forgot-password",
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
      {/* Decorative Background Blobs & Grid Pattern */}
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
            Forgot password
          </CardTitle>
          <CardDescription className="description text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
            Enter your email to change your password
          </CardDescription>
        </CardHeader>

        <CardContent className="content p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleForgotPassword)}
              className="form space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="field space-y-2 text-left">
                    <FormLabel
                      htmlFor="email"
                      className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide"
                    >
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="name@example.com"
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
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Sending email...</span>
                  </>
                ) : (
                  <>
                    <span>Send link</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="footer p-0 flex justify-center mt-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

ForgotPasswordForm.displayName = "ForgotPasswordForm";
