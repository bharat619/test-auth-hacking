import { cn } from "@/lib/utils";

const sizes = {
  sm: { icon: "size-8 text-sm", text: "text-lg" },
  md: { icon: "size-10 text-lg", text: "text-xl" },
  lg: { icon: "size-14 text-2xl", text: "text-3xl" },
};

export function NotifyLogo({
  size = "md",
  showText = true,
  className,
}: {
  size?: keyof typeof sizes;
  showText?: boolean;
  className?: string;
}) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 font-bold text-white shadow-lg shadow-fuchsia-500/25",
          s.icon,
        )}
        aria-hidden
      >
        N
      </div>
      {showText && (
        <span
          className={cn(
            "font-heading font-bold tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-500 bg-clip-text text-transparent",
            s.text,
          )}
        >
          Notify
        </span>
      )}
    </div>
  );
}

export function UserInitial({
  username,
  className,
}: {
  username: string;
  className?: string;
}) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 text-sm font-bold text-white",
        className,
      )}
      aria-hidden
    >
      {initial}
    </div>
  );
}
