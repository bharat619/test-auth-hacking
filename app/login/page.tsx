import { Suspense } from "react";
import { getAuthSetupError } from "@/auth";
import { getAuthCallbackUrl } from "@/lib/auth-url";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const setupError = getAuthSetupError();
  const callbackUrl = await getAuthCallbackUrl();

  return (
    <Suspense fallback={<main className="p-8">Loading...</main>}>
      <LoginForm setupError={setupError} callbackUrl={callbackUrl} />
    </Suspense>
  );
}
