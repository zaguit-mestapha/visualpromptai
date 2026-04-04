import Link from "next/link";

export function LogoIcon({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="512" height="512" rx="96" fill="#ADFF2F"/>
      <path d="M128 96 L198 96 L256 304 L314 96 L384 96 L256 416 Z" fill="#09090B"/>
      <path d="M198 96 L256 248 L314 96 L278 96 L256 176 L234 96 Z" fill="#ADFF2F"/>
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={36} />
      <div className="flex flex-col leading-none">
        <span className="text-lg font-bold font-display tracking-tight text-foreground">Visual</span>
        <span className="text-lg font-bold font-display tracking-tight text-primary">PromptAI</span>
      </div>
    </Link>
  );
}

export function LogoDark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="96" fill="#09090B"/>
      <path d="M128 96 L198 96 L256 304 L314 96 L384 96 L256 416 Z" fill="#ADFF2F"/>
      <path d="M198 96 L256 248 L314 96 L278 96 L256 176 L234 96 Z" fill="#09090B"/>
    </svg>
  );
}
