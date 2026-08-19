import { cn } from "@/lib/utils";
export function Avatar({ name = "AS", className }: { name?: string; className?: string }) { return <div aria-label={`${name} avatar`} className={cn("flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-xs font-bold text-white ring-2 ring-background", className)} role="img">{name}</div>; }
