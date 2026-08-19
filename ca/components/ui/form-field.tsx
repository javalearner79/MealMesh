"use client";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FormFieldProps = { label: string; error?: string; icon?: LucideIcon; children: ReactNode; className?: string };
export function FormField({ label, error, icon: Icon, children, className }: FormFieldProps) {
  return <label className={cn("block text-sm font-medium", className)}><span>{label}</span><span className="relative mt-1.5 flex items-center">{Icon && <Icon aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />}<span className={cn("w-full [&_input]:h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:bg-background [&_input]:py-2 [&_input]:text-sm [&_input]:placeholder:text-muted-foreground [&_input]:focus:border-primary [&_input]:focus:ring-2 [&_input]:focus:ring-primary/15 [&_select]:h-11 [&_select]:w-full [&_select]:rounded-xl [&_select]:border [&_select]:bg-background [&_select]:px-3 [&_textarea]:w-full [&_textarea]:rounded-xl [&_textarea]:border [&_textarea]:bg-background [&_textarea]:p-3", Icon ? "[&_input]:pl-10 [&_input]:pr-10" : "[&_input]:px-3")}>{children}</span></span>{error && <span className="mt-1 block text-xs font-normal text-rose-500" role="alert">{error}</span>}</label>;
}
