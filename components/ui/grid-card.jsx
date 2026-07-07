"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/ui/grid-pattern";

function getRandomPattern(length = 5) {
  return Array.from({ length }, () => [
    Math.floor(Math.random() * 4) + 7,
    Math.floor(Math.random() * 6) + 1,
  ]);
}

export function GridCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "group bg-background relative isolate z-0 flex h-full flex-col justify-between overflow-hidden border px-5 py-4 transition-colors duration-75 cursor-pointer",
        className
      )}
      style={{ borderRadius: 0, borderColor: "var(--border-strong)" }}
      {...props}
    >
      <div className="absolute inset-0">
        <div className="absolute -inset-[25%] -skew-y-12 [mask-image:linear-gradient(225deg,black,transparent)]">
          <GridPattern
            width={30}
            height={30}
            x={0}
            y={0}
            squares={getRandomPattern(5)}
            className="fill-[var(--input)] stroke-[var(--grid-line)] absolute inset-0 size-full translate-y-2 transition-transform duration-150 ease-out group-hover:translate-y-0"
          />
        </div>
        <div
          className="absolute -inset-[10%] opacity-0 blur-[50px] transition-opacity duration-150 group-hover:opacity-10"
          style={{
            background:
              "conic-gradient(#FF3B00 0deg, #FF3B00 117deg, #FF8C00 180deg, #FF3B00 360deg)",
          }}
        />
      </div>
      {children}
    </div>
  );
}
