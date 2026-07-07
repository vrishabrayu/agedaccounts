"use client";
import { useCallback } from "react";
import { ShaderAnimation } from "@/components/ui/shader-lines";
import { AnimatedHero } from "@/components/ui/animated-hero";

export default function Hero() {
  const scrollToProducts = useCallback(() => {
    const el = document.getElementById("marketplace");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden bg-background"
      style={{ minHeight: "100svh" }}
      id="hero-section"
    >
      <ShaderAnimation />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--hero-vignette)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl mx-auto py-20 sm:py-28 lg:py-32 px-4 sm:px-6" style={{ zIndex: 2 }}>
        <AnimatedHero onShopClick={scrollToProducts} />
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-foreground">
          Scroll
        </span>
        <div className="w-px h-8 bg-foreground origin-top animate-[grow_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
