"use client";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import { Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useLink,
  useNotification,
  useRefineOptions,
  useRegister,
} from "@refinedev/core";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROLE_OPTIONS } from "@/constants";
import { UserRole } from "@/types";
import UploadWidget from "@/components/upload-widget";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.nativeEnum(UserRole),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const SignUpForm = () => {
  const Link = useLink();
  const { mutate: register, isPending: isRegistering } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: UserRole.STUDENT,
      image: "",
      imageCldPubId: "",
    },
  });

  const imagePublicId = form.watch("imageCldPubId");

  const { open } = useNotification();

  const { title } = useRefineOptions();

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      register(
        {
          ...values,
          name: values.name,
          image: values.image || undefined,
          imageCldPubId: values.imageCldPubId || undefined,
        },
        {
          onSuccess: (data) => {
            if (data.success === false) {
              toast.error(data.error?.message, {
                richColors: true,
              });
              return;
            }

            toast.success("Account created successfully!", {
              richColors: true,
            });
            form.reset();
          },
        },
      );
    } catch (error) {
      console.log("Register user form error : ", error);
      open?.({
        type: "error",
        message: "Error",
        description: "Something went wrong.",
      });
    }
  };

  const handleSignUpWithGoogle = () => {
    register({
      providerName: "google",
    });
  };

  const handleSignUpWithGitHub = () => {
    register({
      providerName: "github",
    });
  };

  return (
    <div
      className={cn(
        "sign-up",
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
          <CardTitle className="title text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400">
            Sign up
          </CardTitle>
          <CardDescription className="description text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide">
            Create your new account to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="content p-0">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="form space-y-4"
            >
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="field space-y-1.5 text-left">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide">
                      Role *
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="roles flex sm:flex-row gap-4 w-full"
                      >
                        {ROLE_OPTIONS.map((role) => {
                          const isSelected = field.value === role.value;
                          const Icon = role.icon;
                          return (
                            <Label
                              key={role.value}
                              htmlFor={`role-${role.value}`}
                              className={cn(
                                "relative w-full flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-300 select-none group",
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary shadow-xs shadow-primary/5"
                                  : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-800 dark:hover:text-slate-200",
                              )}
                            >
                              <RadioGroupItem
                                value={role.value}
                                id={`role-${role.value}`}
                                className="sr-only"
                              />
                              <div
                                className={cn(
                                  "flex items-center justify-center p-2 rounded-lg transition-colors duration-300 [&>svg]:size-5",
                                  isSelected
                                    ? "bg-primary/20 text-primary"
                                    : "bg-slate-100 dark:bg-zinc-800 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-200",
                                )}
                              >
                                <Icon />
                              </div>
                              <span className="font-bold text-sm flex-1">
                                {role.label}
                              </span>
                              {isSelected && (
                                <div className="size-2 rounded-full bg-primary" />
                              )}
                            </Label>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Profile Photo Upload */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="field space-y-1.5 text-left">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide">
                      Profile Photo
                    </FormLabel>
                    <FormControl>
                      <UploadWidget
                        value={
                          field.value
                            ? {
                                url: field.value,
                                publicId: imagePublicId ?? "",
                              }
                            : null
                        }
                        onChange={(file) => {
                          if (file) {
                            field.onChange(file.url);
                            form.setValue("imageCldPubId", file.publicId, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          } else {
                            field.onChange("");
                            form.setValue("imageCldPubId", "", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="field space-y-1.5 text-left">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide">
                      Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <User className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                        <Input
                          placeholder="Your full name"
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
                name="email"
                render={({ field }) => (
                  <FormItem className="field space-y-1.5 text-left">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Mail className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
                        <Input
                          type="email"
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
                  <FormItem className="field space-y-1.5 text-left">
                    <FormLabel className="text-slate-800 dark:text-slate-200 text-sm font-bold tracking-wide">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Lock className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none z-10" />
                        <InputPassword
                          placeholder="••••••••"
                          className="pl-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary text-slate-900 dark:text-white transition-all duration-200 w-full"
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
                className="submit w-full h-12 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/25 dark:shadow-primary/10 hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                disabled={form.formState.isSubmitting || isRegistering}
              >
                {form.formState.isSubmitting || isRegistering ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Signing up...</span>
                  </>
                ) : (
                  <>
                    <span>Sign up</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {/* Will implement signup/ sign in using google and github */}

              {/* <div className="grid grid-cols-2 gap-4 mt-6">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-border/50 bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/30 cursor-pointer rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleSignUpWithGoogle}
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.8375 8.63637C16.1151 8.63503 13.3926 8.6357 10.6702 8.63601C10.6705 9.76521 10.6688 10.8944 10.6708 12.0233C12.2475 12.0229 13.8242 12.0226 15.4005 12.0233C15.2178 13.1053 14.5747 14.0949 13.6628 14.704C13.0895 15.0895 12.4309 15.3397 11.7519 15.4586C11.0685 15.5752 10.3623 15.5902 9.68064 15.4522C8.9874 15.3138 8.32566 15.025 7.74838 14.6179C6.82531 13.9694 6.12086 13.0205 5.75916 11.9527C5.38931 10.8666 5.38659 9.65804 5.76085 8.57294C6.02053 7.80816 6.45275 7.10169 7.02054 6.52677C7.7209 5.80979 8.63145 5.29725 9.61248 5.08707C10.4525 4.90775 11.3383 4.94197 12.1607 5.19078C12.8597 5.40301 13.5041 5.78605 14.032 6.29013C14.5655 5.75959 15.0964 5.22602 15.629 4.6945C15.9083 4.4084 16.2019 4.13482 16.4724 3.84092C15.6636 3.09241 14.7154 2.49071 13.6794 2.11035C11.8143 1.42392 9.7108 1.40935 7.83312 2.05923C5.71711 2.78366 3.91535 4.36606 2.91636 6.36616C2.56856 7.05534 2.31463 7.79094 2.16209 8.54757C1.77834 10.4327 2.04582 12.4426 2.91533 14.1596C3.48044 15.2803 4.29063 16.2766 5.27339 17.0577C6.20055 17.797 7.28124 18.3431 8.42705 18.6479C9.87286 19.0357 11.4119 19.0269 12.8672 18.6957C14.1825 18.393 15.4269 17.7645 16.4205 16.8472C17.4707 15.882 18.2199 14.6105 18.6165 13.244C19.0491 11.7534 19.1088 10.1622 18.8375 8.63637Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-sm font-medium">Google</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 h-10 border-border/50 bg-slate-50/20 hover:bg-slate-50/50 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/30 cursor-pointer rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                  onClick={handleSignUpWithGitHub}
                  type="button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.5 1.25C5.66797 1.25 1.75 5.26563 1.75 10.2227C1.75 14.1875 4.25781 17.5469 7.73438 18.7344C8.17188 18.8164 8.33203 18.5391 8.33203 18.3008C8.33203 18.0859 8.32422 17.5234 8.32031 16.7734C5.88672 17.3164 5.37109 15.5703 5.37109 15.5703C4.97266 14.5352 4.39844 14.2578 4.39844 14.2578C3.60547 13.6992 4.45703 13.7109 4.45703 13.7109C5.33594 13.7734 5.79688 14.6367 5.79688 14.6367C6.57812 16.0078 7.84375 15.6133 8.34375 15.3828C8.42188 14.8047 8.64844 14.4062 8.89844 14.1836C6.95703 13.957 4.91406 13.1875 4.91406 9.75C4.91406 8.76953 5.25391 7.96875 5.8125 7.34375C5.72266 7.11719 5.42188 6.20312 5.89844 4.96875C5.89844 4.96875 6.63281 4.72656 8.30469 5.88672C9.00391 5.6875 9.75 5.58984 10.4961 5.58594C11.2383 5.58984 11.9883 5.6875 12.6875 5.88672C14.3594 4.72656 15.0898 4.96875 15.0898 4.96875C15.5664 6.20312 15.2656 7.11719 15.1758 7.34375C15.7344 7.97266 16.0742 8.77344 16.0742 9.75C16.0742 13.1953 14.0273 13.9531 12.0781 14.1758C12.3906 14.4531 12.6719 15 12.6719 15.8359C12.6719 17.0352 12.6602 18.0039 12.6602 18.2969C12.6602 18.5352 12.8164 18.8164 13.2617 18.7266C16.7461 17.543 19.25 14.1836 19.25 10.2227C19.25 5.26563 15.332 1.25 10.5 1.25Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-sm font-medium">GitHub</span>
                </Button>
              </div> */}
            </form>
          </Form>
        </CardContent>

        <div className="h-[1px] bg-border/50 w-full my-6" />

        <CardFooter className="p-0 flex justify-center">
          <div className="text-sm text-center font-medium">
            <span className="text-muted-foreground">Have an account? </span>
            <Link
              to="/login"
              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold hover:underline transition-colors cursor-pointer"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

SignUpForm.displayName = "SignUpForm";
