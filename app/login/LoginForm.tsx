"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn } from "lucide-react";
import { NotifyLogo } from "@/components/brand/logo";
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

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <PlayfulBackground />

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10 sm:py-16">
        <div className="mb-8 flex justify-center">
          <NotifyLogo size="lg" />
        </div>

        <Card className="border-violet-100/80 bg-white/80 shadow-xl shadow-violet-500/10 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="font-heading text-2xl">Welcome back!</CardTitle>
            <CardDescription className="text-base">
              Sign in with your username and password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
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
                  required
                  className="h-11 rounded-xl border-violet-100 bg-white/90"
                />
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
                  required
                  className="h-11 rounded-xl border-violet-100 bg-white/90"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <LogIn data-icon="inline-end" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Your notes, always within reach ✨
        </p>
      </main>
    </div>
  );
}
