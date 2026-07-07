"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnimatedHero({ onShopClick }) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["VERIFIED", "AGED", "PREMIUM", "INSTANT", "TRUSTED"],
    []
  );

  useEffect(() => {
    const id = setTimeout(() => {
      setTitleNumber((n) => (n === titles.length - 1 ? 0 : n + 1));
    }, 2200);
    return () => clearTimeout(id);
  }, [titleNumber, titles]);

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 sm:mb-8"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-[var(--border-strong)] text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse flex-shrink-0" />
          Premium Social Account Marketplace
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono font-bold text-foreground tracking-tighter leading-none"
        style={{ fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
      >
        AGED ACCOUNTS
      </motion.h1>

      <div
        className="relative flex w-full justify-center overflow-hidden mt-1 mb-1"
        style={{ height: "clamp(2.8rem, 11vw, 7.5rem)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-mono font-bold tracking-tighter leading-none text-accent"
            style={{ fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
            initial={{ opacity: 0, y: 80 }}
            transition={{ type: "spring", stiffness: 55, damping: 16 }}
            animate={
              titleNumber === index
                ? { y: 0, opacity: 1 }
                : { y: titleNumber > index ? -100 : 100, opacity: 0 }
            }
          >
            {title}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="mt-5 sm:mt-6 max-w-xs sm:max-w-md text-sm font-sans text-muted-foreground leading-relaxed px-2"
      >
        Hand-farmed, aged & verified social media assets.
        Instant delivery. Secure checkout.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full max-w-xs sm:max-w-none sm:w-auto"
      >
        <Button
          size="lg"
          variant="default"
          onClick={onShopClick}
          className="gap-3 w-full sm:w-auto justify-center"
          id="hero-browse-btn"
        >
          Browse Products
          <MoveRight className="w-4 h-4" />
        </Button>
        <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto justify-center">
          <a href="/about">How It Works</a>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-muted-foreground text-[9px] sm:text-[10px] font-mono tracking-[0.12em] sm:tracking-[0.15em] uppercase"
      >
        <span>500+ customers</span>
        <span className="w-px h-3 bg-border hidden sm:block" />
        <span>Instant delivery</span>
        <span className="w-px h-3 bg-border hidden sm:block" />
        <span>Secure checkout</span>
      </motion.div>
    </div>
  );
}
