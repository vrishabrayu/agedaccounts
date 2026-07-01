"use client";
import { useCallback } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { AnimatedHero } from "@/components/ui/animated-hero";

export default function Hero() {
  const scrollToProducts = useCallback(() => {
    const el = document.getElementById("marketplace");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden bg-[#0D0D0D]"
      style={{ minHeight: "100svh" }}
      id="hero-section"
    >
      {/* WebGL dotted wave — scoped to this section */}
      <DottedSurface className="z-0" />

      {/* Radial glow: bright light emanating from center, sitting behind CTA */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(239,239,233,0.09) 0%, rgba(239,239,233,0.04) 35%, transparent 70%)",
          filter: "blur(40px)",
          zIndex: 1,
        }}
      />

      {/* Outer vignette so edges stay dark and text pops */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(13,13,13,0.80) 100%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Hero text content */}
      <div
        className="relative w-full max-w-4xl mx-auto py-20 sm:py-28 lg:py-32 px-4 sm:px-6"
        style={{ zIndex: 2 }}
      >
        <AnimatedHero onShopClick={scrollToProducts} />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#EFEFE9]">
          Scroll
        </span>
        <div className="w-px h-8 bg-[#EFEFE9] origin-top animate-[grow_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}

