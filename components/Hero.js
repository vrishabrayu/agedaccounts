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
      className="relative flex items-center justify-center overflow-hidden bg-[#0D0D0D]"
      style={{ minHeight: "100svh" }}
      id="hero-section"
    >
      {/* WebGL Shader — the signature element */}
      <ShaderAnimation />

      {/* Dark vignette overlay so text is legible against the shader */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(13,13,13,0.35) 0%, rgba(13,13,13,0.75) 100%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Hero text content — layered above shader */}
      <div className="relative w-full max-w-4xl mx-auto py-20 sm:py-28 lg:py-32 px-4 sm:px-6" style={{ zIndex: 2 }}>
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
