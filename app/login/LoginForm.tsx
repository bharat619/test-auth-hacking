"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { NotifyLogo, UserInitial } from "@/components/brand/logo";
import { PlayfulBackground } from "@/components/layout/playful-background";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type LoginStep = "username" | "password";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<LoginStep>("username");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleUsernameNext(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    setStep("password");
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Invalid credentials. Please try again.");
        return;
      }

      const from = searchParams.get("from") ?? "/notes";
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setError("");
    setPassword("");
    setStep("username");
  }

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <PlayfulBackground />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:py-16">
        <div className="mb-8 flex justify-center">
          <NotifyLogo size="lg" />
        </div>

        <Card className="border-violet-100/80 bg-white/80 shadow-xl shadow-violet-500/10 backdrop-blur-sm">
          <CardHeader className="space-y-3 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-2xl">
                {step === "username" ? "Welcome back!" : "Almost there"}
              </CardTitle>
              <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                Step {step === "username" ? 1 : 2} of 2
              </span>
            </div>
            <CardDescription className="text-base">
              {step === "username"
                ? "Enter your username to get started."
                : "Enter your password to sign in."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === "username" ? (
              <form
                onSubmit={handleUsernameNext}
                className={cn("space-y-5 animate-in fade-in slide-in-from-right-4 duration-300")}
              >
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="yourname"
                    autoComplete="username"
                    autoFocus
                    className="h-11 rounded-xl border-violet-100 bg-white/90"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <Button type="submit" size="lg" className="h-11 w-full rounded-xl">
                  Next
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </form>
            ) : (
              <form
                onSubmit={handleLogin}
                className={cn("space-y-5 animate-in fade-in slide-in-from-right-4 duration-300")}
              >
                <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/70 p-3">
                  <UserInitial username={username.trim()} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Signing in as
                    </p>
                    <p className="truncate font-semibold text-foreground">
                      {username.trim()}
                    </p>
                  </div>
                  <Sparkles className="size-4 shrink-0 text-fuchsia-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    autoFocus
                    className="h-11 rounded-xl border-violet-100 bg-white/90"
                  />
                </div>

                {error && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-xl sm:flex-1"
                    onClick={handleBack}
                    disabled={loading}
                  >
                    <ArrowLeft data-icon="inline-start" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    className="h-11 rounded-xl sm:flex-[2]"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Your notes, always within reach ✨
        </p>
      </main>
    </div>
  );
}
