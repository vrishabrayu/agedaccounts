"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-accent-foreground border border-accent hover:bg-transparent hover:text-accent",
        secondary:
          "bg-transparent text-foreground border border-[var(--border-strong)] hover:bg-foreground hover:text-background hover:border-foreground",
        outline:
          "bg-transparent text-foreground border border-[var(--border-strong)] hover:bg-[var(--input)]",
        ghost:
          "hover:bg-[var(--input)] text-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
        destructive:
          "bg-destructive text-accent-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 py-1.5 text-[10px]",
        lg: "h-12 px-8 py-3",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
