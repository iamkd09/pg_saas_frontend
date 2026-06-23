"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { MobileBrandBanner } from "@/components/auth/mobile-brand-banner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAuthenticated, login } from "@/lib/auth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

const formContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const formItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const usernameField = register("username");
  const passwordField = register("password");

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    try {
      await login(
        { username: values.username, password: values.password },
        values.rememberMe
      );
      router.push("/dashboard");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Unable to sign in."
      );
    }
  }

  return (
    <div className="relative flex w-full flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[420px] space-y-6">
        <MobileBrandBanner />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-primary/5 backdrop-blur-sm sm:p-8"
        >
          <div className="pointer-events-none absolute -top-24 -right-24 size-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-indigo-500/5 blur-3xl" />

          <div className="relative space-y-1.5">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]"
            >
              Welcome back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              Sign in to manage your properties and tenants.
            </motion.p>
          </div>

          <motion.form
            variants={formContainer}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit(onSubmit)}
            className="relative mt-7 space-y-5"
            noValidate
          >
            <AnimatePresence mode="wait">
              {serverError ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <motion.div variants={formItem} className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "username"
                    ? "ring-2 ring-primary/20 rounded-lg"
                    : ""
                }`}
              >
                <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  aria-invalid={!!errors.username}
                  className="h-12 bg-background/50 pl-10 transition-shadow focus-visible:shadow-md focus-visible:shadow-primary/10"
                  {...usernameField}
                  onFocus={() => setFocusedField("username")}
                  onBlur={(e) => {
                    setFocusedField(null);
                    void usernameField.onBlur(e);
                  }}
                />
              </div>
              <AnimatePresence>
                {errors.username ? (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-destructive"
                  >
                    {errors.username.message}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={formItem} className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedField === "password"
                    ? "ring-2 ring-primary/20 rounded-lg"
                    : ""
                }`}
              >
                <Lock className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password}
                  className="h-12 bg-background/50 pl-10 pr-11 transition-shadow focus-visible:shadow-md focus-visible:shadow-primary/10"
                  {...passwordField}
                  onFocus={() => setFocusedField("password")}
                  onBlur={(e) => {
                    setFocusedField(null);
                    void passwordField.onBlur(e);
                  }}
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password ? (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-sm text-destructive"
                  >
                    {errors.password.message}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={formItem}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2.5">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  )}
                />
                <Label
                  htmlFor="rememberMe"
                  className="cursor-pointer font-normal text-muted-foreground"
                >
                  Remember me
                </Label>
              </div>
              <motion.button
                type="button"
                whileHover={{ x: 2 }}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Forgot password?
              </motion.button>
            </motion.div>

            <motion.div variants={formItem}>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="group relative h-12 w-full overflow-hidden bg-gradient-to-r from-primary to-indigo-600 text-sm font-medium shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
                size="lg"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                {!isSubmitting ? (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                ) : null}
              </Button>
            </motion.div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="relative mt-6 text-center text-sm text-muted-foreground"
          >
            Need an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            >
              Create your organization
            </Link>
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-xs text-muted-foreground/70"
        >
          Protected by enterprise-grade security
        </motion.p>
      </div>
    </div>
  );
}
