"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createClient } from "@/lib/client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Route } from "next";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Must contain an uppercase letter.")
      .regex(/[a-z]/, "Must contain a lowercase letter.")
      .regex(/[0-9]/, "Must contain a number.")
      .regex(/[^A-Za-z0-9]/, "Must contain a special character."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof passwordSchema>;

export default function ResetPasswordPage() {
  const [authError] = useState<string | null>(null);
  const [, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setSessionError(
          "Your password reset link is invalid or has expired. Please request a new one.",
        );
        return;
      }

      setSessionReady(true);
    }

    checkSession();
  }, []);

  async function onSubmit(value: FormValues) {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: value.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Password updated successfully", {
      description: "Redirecting to login...",
    });

    await supabase.auth.signOut();

    router.replace("/login");
  }

  if (sessionError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Reset Link Invalid
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">{sessionError}</p>

            <Button onClick={() => router.replace("/forgot-password" as Route)}>
              Request New Link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Create New Password
          </CardTitle>

          <p className="text-center text-sm text-muted-foreground">
            Choose a strong password for your account.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label>New Password</Label>

              <Input type="password" {...register("password")} />

              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>

              <Input type="password" {...register("confirmPassword")} />

              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {authError && (
              <p className="text-sm text-destructive">{authError}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
