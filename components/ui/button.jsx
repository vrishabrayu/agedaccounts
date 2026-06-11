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
          "bg-[#FF3B00] text-[#EFEFE9] border border-[#FF3B00] hover:bg-transparent hover:text-[#FF3B00]",
        secondary:
          "bg-transparent text-[#EFEFE9] border border-[rgba(239,239,233,0.22)] hover:bg-[#EFEFE9] hover:text-[#0D0D0D] hover:border-[#EFEFE9]",
        outline:
          "bg-transparent text-[#EFEFE9] border border-[rgba(239,239,233,0.22)] hover:bg-[rgba(239,239,233,0.08)]",
        ghost:
          "hover:bg-[rgba(239,239,233,0.06)] text-[#EFEFE9]",
        link: "text-[#EFEFE9] underline-offset-4 hover:underline",
        destructive:
          "bg-[#FF3B00] text-[#EFEFE9] hover:bg-[#FF3B00]/90",
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
