"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 sm:mb-8"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-[rgba(239,239,233,0.18)] text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.18em] sm:tracking-[0.2em] uppercase text-[rgba(239,239,233,0.55)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B00] animate-pulse flex-shrink-0" />
          Premium Social Account Marketplace
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="font-mono font-bold text-[#EFEFE9] tracking-tighter leading-none"
        style={{ fontSize: "clamp(2.5rem, 10vw, 7rem)" }}
      >
        AGED ACCOUNTS
      </motion.h1>

      {/* Rotating word — fixed height that's generous enough for animation */}
      <div
        className="relative flex w-full justify-center overflow-hidden mt-1 mb-1"
        style={{ height: "clamp(2.8rem, 11vw, 7.5rem)" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {titles.map((title, index) => (
          <motion.span
            key={index}
            className="absolute font-mono font-bold tracking-tighter leading-none text-[#FF3B00]"
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

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="mt-5 sm:mt-6 max-w-xs sm:max-w-md text-sm font-sans text-[rgba(239,239,233,0.5)] leading-relaxed px-2"
      >
        Hand-farmed, aged & verified social media assets.
        Instant delivery. Secure checkout.
      </motion.p>

      {/* CTAs — stack vertically on mobile, side by side on sm+ */}
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

      {/* Know Details Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 sm:mt-10 w-full max-w-md sm:max-w-2xl text-left bg-[rgba(13,13,13,0.4)] backdrop-blur-md rounded-xl border border-[rgba(239,239,233,0.1)] px-4 sm:px-6 shadow-2xl relative z-20"
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="know-details" className="border-none">
            <AccordionTrigger className="text-[#EFEFE9] hover:text-[#FF3B00] font-mono tracking-widest text-[11px] sm:text-xs py-5">
              KNOW DETAILS
            </AccordionTrigger>
            <AccordionContent className="text-[rgba(239,239,233,0.6)] font-sans text-[13px] sm:text-sm space-y-6 pb-6 leading-relaxed">
              <div>
                <h4 className="text-[#EFEFE9] font-medium mb-2 font-mono text-[10px] tracking-widest uppercase">Instagram Account Information</h4>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90">
                  <li>Accounts are automatically registered, you&apos;ll get ready to use accounts.</li>
                  <li>All accounts were originally created in 2012/13.</li>
                  <li>Profiles are fully blank, with no added profile pictures and followers/followings.</li>
                  <li>Two-Factor Authentication (2FA) is enabled on every account.</li>
                  <li>Accounts have been registered using IP addresses from various countries.</li>
                  <li>Mail provided will be Firstmail.ltd which can be secured by the client itself.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-[#EFEFE9] font-medium mb-2 font-mono text-[10px] tracking-widest uppercase">Important Information</h4>
                <p className="opacity-90">Instagram may occasionally request SMS verification during login or account activity. This is a normal security measure. You can complete verification using your own phone number or a trusted SMS activation service.</p>
              </div>
              
              <div>
                <h4 className="text-[#EFEFE9] font-medium mb-2 font-mono text-[10px] tracking-widest uppercase">Login Instructions</h4>
                <ul className="list-disc pl-5 space-y-1.5 opacity-90">
                  <li>Always use the provided 2FA code or backup codes when signing in.</li>
                  <li>Backup codes should be stored securely, as they can be used if you cannot access your authenticator.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-[#EFEFE9] font-medium mb-2 font-mono text-[10px] tracking-widest uppercase">Account Data Format</h4>
                <p className="mb-3 opacity-90">Account details are provided in a standardized format for easy reading. The exact formatting may vary slightly between account sets and does not affect the quality or functionality of the account.</p>
                <div className="font-mono text-[10px] sm:text-[11px] bg-black/60 p-3 rounded-lg border border-[rgba(239,239,233,0.1)] text-[#FF3B00] overflow-x-auto whitespace-nowrap">
                  <span className="text-[rgba(239,239,233,0.4)]">Example Format:</span><br/>
                  Email : Email Password : Username : Password : 2FA Secret key
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      {/* Stats bar — wraps gracefully on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[rgba(239,239,233,0.35)] text-[9px] sm:text-[10px] font-mono tracking-[0.12em] sm:tracking-[0.15em] uppercase"
      >
        <span>500+ customers</span>
        <span className="w-px h-3 bg-[rgba(239,239,233,0.15)] hidden sm:block" />
        <span>Instant delivery</span>
        <span className="w-px h-3 bg-[rgba(239,239,233,0.15)] hidden sm:block" />
        <span>Secure checkout</span>
      </motion.div>
    </div>
  );
}
