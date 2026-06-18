import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="p-8">Loading...</main>}>
      <LoginForm />
    </Suspense>
  );
}
