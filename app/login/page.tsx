import { Suspense } from "react";
import { getAuthSetupError } from "@/auth";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const setupError = getAuthSetupError();

  return (
    <Suspense fallback={<main className="p-8">Loading...</main>}>
      <LoginForm setupError={setupError} />
    </Suspense>
  );
}
