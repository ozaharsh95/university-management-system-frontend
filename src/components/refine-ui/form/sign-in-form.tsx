"use client";

import { useState } from "react";

import {
  CircleHelp,
  Mail,
  Lock,
  Loader2,
  Shield,
  ArrowRight,
} from "lucide-react";

import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useLink, useLogin, useRefineOptions } from "@refinedev/core";

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

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().optional(),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export const SignInForm = () => {
  const Link = useLink();
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const { title } = useRefineOptions();

  const handleSignIn = async (values: SignInFormValues) => {
    const { email, password } = values;

    login(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          if (data.success === false) {
            toast.error(data.error?.message || "Invalid credentials", {
              richColors: true,
            });
            return;
          }
          toast.success("Welcome back!", {
            richColors: true,
          });
        },
        onError: (error) => {
          toast.error(error?.message || "Login failed. Please try again.", {
            richColors: true,
          });
        },
      },
    );
  };

  const handleSignInWithGoogle = () => {
    login({
      providerName: "google",
    });
  };

  const handleSignInWithGitHub = () => {
    login({
      providerName: "github",
    });
  };

  return (
    <div
      className={cn(
        "sign-in",
        "relative",
        "flex",
        "flex-col",
        "items-center",
        "justify-center",
        "px-6",
        "py-12",
        "min-h-svh",
        "bg-[#f8fafc] dark:bg-zinc-950",
        "overflow-hidden",
      )}
    >
      {/* Decorative Background Blobs & Grid Pattern */}
      <div className="absolute top-10 right-10 w-44 h-44 opacity-25 dark:opacity-10 pointer-events-none bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[120px] pointer-events-none" />

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
          "transition-all duration-500",
        )}
      >
        <CardHeader className="header text-center space-y-2 pb-6 px-0 pt-0">
          <CardTitle className="title text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="description text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
            Sign in to access your university portal
          </CardDescription>
        </CardHeader>

        <CardContent className="content p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignIn)}
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="field space-y-2 text-left">
                    <FormLabel
                      htmlFor="password"
                      className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide"
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                        <InputPassword
                          id="password"
                          required
                          placeholder=""
                          className="pl-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white transition-all duration-200"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="row flex items-center justify-between gap-2 pt-1">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="remember flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          id="remember"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(
                              checked === "indeterminate" ? false : checked,
                            )
                          }
                          className="h-5 w-5 rounded border-slate-300 dark:border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary cursor-pointer"
                        />
                      </FormControl>
                      <FormLabel
                        htmlFor="remember"
                        className="text-sm text-slate-600 dark:text-slate-400 font-medium  select-none"
                      >
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Link to="/forgot-password">
                  <Button
                    variant="link"
                    className="forgot-link p-0 h-auto text-sm text-primary hover:text-primary/95 font-medium hover:underline transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </Button>
                </Link>
              </div>

              <Button
                type="submit"
                className="submit w-full h-12 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-primary/25 dark:shadow-primary/10 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="split flex items-center gap-4 py-2">
                <div className="h-[1px] bg-slate-200 dark:bg-zinc-800 flex-1" />
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider">
                  or
                </span>
                <div className="h-[1px] bg-slate-200 dark:bg-zinc-800 flex-1" />
              </div>

              {/* Will implement sign in with google and github */}

              {/* <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-border/50 bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/30 cursor-pointer rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleSignInWithGoogle}
                  type="button"
                >
                  ...
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-border/50 bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/30 cursor-pointer rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleSignInWithGitHub}
                  type="button"
                >
                  ...
                </Button>
              </div> */}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="footer p-0 flex justify-center">
          <div className="w-full bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/80 rounded-2xl p-4 text-center text-sm font-medium">
            <span className="text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-primary hover:text-primary/90 font-bold hover:underline transition-colors cursor-pointer"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

SignInForm.displayName = "SignInForm";
