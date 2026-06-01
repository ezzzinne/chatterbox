"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { PasswordInput } from "@/components/password-input";

const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character.",
    ),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (value: SignupFormValues) => {
    setAuthError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: value.email.trim(),
      password: value.password,
      options: {
        data: {
          first_name: value.firstName.trim(),
          last_name: value.lastName.trim(),
          username: value.username.trim(),
          full_name: `${value.firstName.trim()} ${value.lastName.trim()}`,
        },
      },
    });
    if (error) {
      if (
        error.message.toLowerCase().includes("profiles_username_unique_idx")
      ) {
        setAuthError("This username is already taken.");
        return;
      }

      setAuthError(error.message);
      return;
    }
    router.replace("/dashboard" as Route);
  };

  const signInWithGoogle = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  const signInWithGitHub = async () => {
    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={signInWithGoogle}
            >
              Sign up with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={signInWithGitHub}
            >
              Sign up with GitHub
            </Button>
          </div>

          <div className="relative py-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground uppercase">
                Or sign up manually
              </span>
            </div>
          </div>

          <form
            method="post"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} />
                {errors.firstName && (
                  <p className="text-sm text-destructive">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-sm text-destructive">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register("username")} />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <PasswordInput type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
