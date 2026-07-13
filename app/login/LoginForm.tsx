"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
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

const ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "Auth0 is misconfigured. Check AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, and AUTH0_SECRET in .env.local.",
  AccessDenied:
    "Access was denied. Your account may not be allowed to use this app.",
  OAuthSignin: "Could not start Auth0 sign-in. Verify AUTH0_DOMAIN is correct.",
  OAuthCallback:
    "Auth0 sign-in callback failed. Add the exact callback URL below to Auth0 Allowed Callback URLs.",
};

export default function LoginForm({
  setupError,
  callbackUrl,
}: {
  setupError: string | null;
  callbackUrl: string;
}) {
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");
  const errorMessage =
    setupError ??
    (authError
      ? (ERROR_MESSAGES[authError] ?? "Sign in failed. Please try again.")
      : null);

  function handleAuth0Login(forcePrompt = false) {
    if (setupError) return;
    const callbackUrl = searchParams.get("from") ?? "/notes";
    void signIn(
      "auth0",
      forcePrompt
        ? { callbackUrl, authorizationParams: { prompt: "login" } }
        : { callbackUrl },
    );
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
            <CardTitle className="font-heading text-2xl">
              Welcome back!
            </CardTitle>
            <CardDescription className="text-base">
              Sign in with your organization account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <p>{errorMessage}</p>
                {setupError && (
                  <p className="mt-2 text-xs text-destructive/80">
                    Auth0 callback URL:{" "}
                    <code className="rounded bg-destructive/10 px-1">
                      http://localhost:3000/api/auth/callback/auth0
                    </code>
                  </p>
                )}
              </div>
            )}

            <Button
              type="button"
              size="lg"
              className="h-11 w-full rounded-xl"
              onClick={() => handleAuth0Login()}
              disabled={Boolean(setupError)}
            >
              Sign in
              <LogIn data-icon="inline-end" />
            </Button>

            {!setupError && (
              <button
                type="button"
                className="w-full text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                onClick={() => handleAuth0Login(true)}
              >
                Use a different account
              </button>
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
