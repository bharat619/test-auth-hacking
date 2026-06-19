import { cn } from "@/lib/utils";

export function PlayfulBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
      aria-hidden
    >
      <div className="absolute -left-24 -top-24 size-72 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="absolute -right-16 top-1/4 size-80 rounded-full bg-fuchsia-300/35 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 size-96 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_oklch(0.95_0.04_310)_0%,_transparent_55%)]" />
    </div>
  );
}
