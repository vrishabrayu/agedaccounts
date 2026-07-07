"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, Mail, ArrowUpRight } from "lucide-react";

export function SiteFooter() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-[#0D0D0D] border-t border-[rgba(239,239,233,0.08)] pb-8 pt-16" id="footer">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div>
            <span className="font-mono font-bold text-[#EFEFE9] text-xl tracking-tighter">
              AGED ACCOUNTS
            </span>
            <p className="mt-2 text-[11px] font-mono text-[rgba(239,239,233,0.35)] tracking-wider uppercase max-w-xs">
              Premium social media assets. <br />Delivered instantly.
            </p>
          </div>
          {/* Social icons */}
          <div className="flex gap-2">
            {[
            { icon: <Share2 className="h-4 w-4" />, href: "https://twitter.com", label: "Twitter" },
              { icon: <Mail className="h-4 w-4" />, href: "mailto:support@ageddaccount.store", label: "Email" },
            ].map((link, i) => (
              <Button key={i} variant="secondary" size="icon" asChild>
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                  {link.icon}
                </a>
              </Button>
            ))}
          </div>
        </div>

        {/* Links grid */}
        <div className="border-t border-[rgba(239,239,233,0.08)] pt-8 pb-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="text-[10px] font-mono font-bold text-[rgba(239,239,233,0.3)] tracking-[0.2em] uppercase mb-4">
              Explore
            </div>
            {[
              { href: "#marketplace", label: "Marketplace" },
              { href: "/about", label: "About Us" },
              { href: "/blog", label: "Blog" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block py-1 text-[11px] font-mono text-[rgba(239,239,233,0.55)] hover:text-[#EFEFE9] transition-colors tracking-wider uppercase"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[rgba(239,239,233,0.3)] tracking-[0.2em] uppercase mb-4">
              Support
            </div>
            {[
              { href: "/support", label: "Help & Support" },
              { href: "mailto:support@ageddaccount.store", label: "Contact" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="block py-1 text-[11px] font-mono text-[rgba(239,239,233,0.55)] hover:text-[#EFEFE9] transition-colors tracking-wider uppercase"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[rgba(239,239,233,0.3)] tracking-[0.2em] uppercase mb-4">
              Legal
            </div>
            {[
              { href: "#", label: "Privacy Policy" },
              { href: "#", label: "Terms of Service" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="block py-1 text-[11px] font-mono text-[rgba(239,239,233,0.55)] hover:text-[#EFEFE9] transition-colors tracking-wider uppercase"
              >
                {l.label}
              </a>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold text-[rgba(239,239,233,0.3)] tracking-[0.2em] uppercase mb-4">
              Platforms
            </div>
            {["Instagram", "TikTok", "Twitter", "Reddit", "YouTube"].map((p) => (
              <a
                key={p}
                href="#marketplace"
                className="block py-1 text-[11px] font-mono text-[rgba(239,239,233,0.55)] hover:text-[#EFEFE9] transition-colors tracking-wider uppercase"
              >
                {p}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-[rgba(239,239,233,0.08)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-[rgba(239,239,233,0.25)] tracking-widest uppercase">
            © {new Date().getFullYear()} Aged Accounts. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="text-[10px] font-mono font-bold text-[rgba(239,239,233,0.35)] hover:text-[#EFEFE9] tracking-widest uppercase transition-colors flex items-center gap-1.5"
          >
            Back to top <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
