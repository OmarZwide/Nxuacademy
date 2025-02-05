import { cn } from "@/lib/utils";

interface GradientProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rainbow" | "subtle" | "primary";
}

export function Gradient({
  variant = "rainbow",
  className,
  ...props
}: GradientProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 -z-10",
        {
          "bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 opacity-90":
            variant === "primary",
          "bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 opacity-10 after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] after:from-blue-200 after:via-green-200 after:to-yellow-200 after:opacity-10":
            variant === "rainbow",
          "bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 opacity-50":
            variant === "subtle",
        },
        className
      )}
      {...props}
    />
  );
}
