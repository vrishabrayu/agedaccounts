"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const TestimonialsColumn = ({ className, testimonials, duration = 10 }) => {
  return (
    <div className={className} style={{ overflow: "hidden" }}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-4 pb-4"
      >
        {[...Array(2)].map((_, loopIdx) => (
          <React.Fragment key={loopIdx}>
            {testimonials.map(({ text, image, name, role, platform }, i) => (
              <div
                key={i}
                className="p-6 border border-[var(--border)] bg-[var(--card)] max-w-xs w-full"
                style={{ borderRadius: 0 }}
              >
                {/* Platform tag */}
                {platform && (
                  <div className="mb-3 inline-block px-2 py-0.5 border border-[#FF3B00] text-[#FF3B00] text-[9px] font-mono font-bold tracking-widest uppercase">
                    {platform}
                  </div>
                )}
                <p className="text-sm font-sans text-[var(--foreground)] leading-relaxed">
                  &ldquo;{text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[var(--border)]">
                  <Image
                    width={36}
                    height={36}
                    src={image}
                    alt={name}
                    className="h-9 w-9 rounded-full object-cover grayscale"
                  />
                  <div className="flex flex-col">
                    <div className="text-xs font-mono font-bold text-[var(--foreground)] tracking-wide">
                      {name}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--text-subtle)] tracking-wider uppercase mt-0.5">
                      {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export const testimonialData = [
  {
    text: "Bought three Instagram accounts last month. All aged, all with real engagement histories. Turned one around and sold it for 3x within weeks. The quality is unmatched.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Jordan K.",
    role: "Digital Flipper",
    platform: "Instagram",
  },
  {
    text: "I run a growth agency. We source Twitter accounts here for our clients' outreach campaigns. Zero bans so far, every account has aged perfectly. These guys are legit.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Priya S.",
    role: "Growth Agency Owner",
    platform: "Twitter / X",
  },
  {
    text: "The Reddit accounts have insane karma for the price. Our content gets traction immediately because the accounts have years of credibility behind them.",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
    name: "Marcus T.",
    role: "Content Marketer",
    platform: "Reddit",
  },
  {
    text: "Delivery was instant. Had access to a 200k TikTok account within minutes of payment. Used it to launch a product — crossed 1M views in the first week.",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    name: "Sofia R.",
    role: "E-commerce Founder",
    platform: "TikTok",
  },
  {
    text: "I was sceptical at first but the Discord server they handed over came with the full admin access and genuine member history. Active community from day one.",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    name: "Aiden M.",
    role: "Community Builder",
    platform: "Discord",
  },
  {
    text: "Used 10+ Facebook aged accounts for a whithat ad campaign. Every account passed FB's trust checks because they had real post history. Support team was super responsive.",
    image: "https://randomuser.me/api/portraits/women/62.jpg",
    name: "Layla H.",
    role: "Media Buyer",
    platform: "Facebook",
  },
  {
    text: "The YouTube channel came with 250k subs and a real watch-time history. Monetisation enabled from day one. Best investment I've made this year.",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    name: "Ethan C.",
    role: "YouTuber",
    platform: "YouTube",
  },
  {
    text: "I bought a bulk order of Telegram accounts for a crypto project. All aged, all phone-verified. Not a single one got flagged. Will be ordering again.",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    name: "Nadia V.",
    role: "Web3 Marketer",
    platform: "Telegram",
  },
  {
    text: "Snapchat lifestyle account with 200k views / day. The audience was genuinely engaged. Ran a promo in week one and it converted at 6%. Insane.",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Ryo T.",
    role: "Brand Manager",
    platform: "Snapchat",
  },
];

const firstColumn  = testimonialData.slice(0, 3);
const secondColumn = testimonialData.slice(3, 6);
const thirdColumn  = testimonialData.slice(6, 9);

export function Testimonials() {
  return (
    <section className="py-24 relative bg-[var(--background)]" id="testimonials">
      {/* Section header */}
      <div className="max-w-screen-xl mx-auto px-6 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <span className="inline-block px-4 py-1 border border-[var(--border-strong)] text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[var(--filter-inactive)] mb-6">
            Customer Proof
          </span>
          <h2
            className="font-mono font-bold text-[var(--foreground)] tracking-tighter"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            WHAT OUR BUYERS SAY
          </h2>
          <p className="mt-4 text-sm font-sans text-[var(--filter-inactive)] max-w-md">
            Real results from real customers — marketers, flippers, and founders who trust us.
          </p>
        </motion.div>
      </div>

      {/* Columns */}
      <div
        className="flex justify-center gap-4 px-4 sm:px-6"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          maxHeight: "clamp(480px, 65vh, 700px)",
          overflow: "hidden",
        }}
      >
        <TestimonialsColumn testimonials={firstColumn} duration={18} />
        <TestimonialsColumn
          testimonials={secondColumn}
          className="hidden md:block"
          duration={22}
        />
        <TestimonialsColumn
          testimonials={thirdColumn}
          className="hidden lg:block"
          duration={20}
        />
      </div>
    </section>
  );
}
