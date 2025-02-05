import { cn } from "@/lib/utils";

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      {...props}
    >
      {/* Lion Head Circle Background */}
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" opacity="0.2" />

      {/* Lion Face */}
      <path
        d="M20 12c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z"
        fill="currentColor"
      />

      {/* Mane */}
      <path
        d="M20 8c-6.6 0-12 5.4-12 12 0 6.6 5.4 12 12 12 6.6 0 12-5.4 12-12 0-6.6-5.4-12-12-12zm0 22c-5.5 0-10-4.5-10-10S14.5 10 20 10s10 4.5 10 10-4.5 10-10 10z"
        fill="currentColor"
        opacity="0.7"
      />

      {/* Eyes */}
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
      <circle cx="23" cy="19" r="1.5" fill="currentColor" />

      {/* Nose */}
      <path
        d="M20 20.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 3c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        fill="currentColor"
      />

      {/* Whiskers */}
      <path
        d="M15 21h-3M25 21h3M18 23l-2 2M22 23l2 2"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}