"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import {
  Instagram, Youtube, TikTok2 as TikTokIcon,
  ShoppingBag, MenuIcon, XIcon, ShoppingCart,
  Info, LifeBuoy, Shield, FileText, ChevronRight,
  Zap, Star, Users, Globe,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
} from "./ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./ui/accordion";
import ThemeToggle from "./ThemeToggle";

// ─── Platform data ────────────────────────────────────────────────
const platformLinks = [
  {
    title: "Instagram",
    href: "/#marketplace",
    description: "Aged accounts with real engagement history",
    icon: ({ className, ...p }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    title: "TikTok",
    href: "/#marketplace",
    description: "Viral-ready profiles with real follower bases",
    icon: ({ className, ...p }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.69a8.16 8.16 0 004.77 1.52V7.76a4.85 4.85 0 01-1-.07z"/>
      </svg>
    ),
  },
  {
    title: "YouTube",
    href: "/#marketplace",
    description: "Monetisable channels with watch-time history",
    icon: ({ className, ...p }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
  {
    title: "Twitter / X",
    href: "/#marketplace",
    description: "Established accounts with aged tweet history",
    icon: ({ className, ...p }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    title: "Reddit",
    href: "/#marketplace",
    description: "High-karma accounts with posting history",
    icon: ({ className, ...p }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
  },
  {
    title: "Discord",
    href: "/#marketplace",
    description: "Active servers and aged member accounts",
    icon: ({ className, ...p }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" {...p}>
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.042.03.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    ),
  },
];

const companyLinks = [
  {
    title: "About Us",
    href: "/about",
    description: "Our story and what we stand for",
    icon: Users,
  },
  {
    title: "Support & FAQ",
    href: "/support",
    description: "Get help with your purchase",
    icon: LifeBuoy,
  },
  {
    title: "Why Trust Us",
    href: "/about",
    description: "14-point audit, instant delivery",
    icon: Shield,
  },
  {
    title: "How It Works",
    href: "/#how-it-works",
    description: "Browse → checkout → receive",
    icon: Zap,
  },
];

const mobileSections = [
  { id: "platforms", name: "Platforms", list: platformLinks },
  { id: "company", name: "Company", list: companyLinks },
];

// ─── Main Navbar ──────────────────────────────────────────────────
export default function Navbar() {
  const { cartItemCount, toggleDrawer } = useCart();

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          height: "var(--navbar-height, 72px)",
          display: "flex",
          alignItems: "center",
          paddingLeft: "clamp(1rem, 4vw, 2.5rem)",
          paddingRight: "clamp(1rem, 4vw, 2.5rem)",
          background: "var(--navbar-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* ── Logo ── */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "clamp(11px, 1.5vw, 13px)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--foreground)",
            whiteSpace: "nowrap",
            minHeight: "unset",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              background: "#FF3B00",
              borderRadius: "50%",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          AGED ACCOUNTS
        </Link>

        {/* ── Desktop Navigation Menu ── */}
        <div className="hidden lg:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {/* Platforms */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Platforms</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-full md:w-[720px] md:grid-cols-[1fr_0.38fr]">
                    {/* Left: 3 grid cards */}
                    <ul className="grid grid-cols-3 gap-3 p-4 border-r border-[var(--border)]">
                      {platformLinks.slice(0, 3).map((link) => (
                        <li key={link.title}>
                          <NavGridCard link={link} />
                        </li>
                      ))}
                    </ul>
                    {/* Right: small items */}
                    <ul className="flex flex-col gap-0.5 p-3">
                      {platformLinks.slice(3).map((link) => (
                        <li key={link.title}>
                          <NavSmallItem
                            item={link}
                            href={link.href}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Company */}
              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-full md:w-[480px] grid-cols-2 gap-3 p-4">
                    {companyLinks.map((link) => (
                      <NavLargeItem key={link.title} href={link.href} link={link} />
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Marketplace direct link */}
              <NavigationMenuItem>
                <NavigationMenuLink href="/#marketplace" className="cursor-pointer">
                  Marketplace
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* ── Right actions ── */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ThemeToggle />
          {/* Cart */}
          <button
            onClick={toggleDrawer}
            aria-label="Open cart"
            style={{
              position: "relative",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "1px solid var(--border-strong)",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            className="hover:border-[var(--border-strong)] hover:text-foreground"
          >
            <ShoppingCart size={16} />
            {cartItemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  width: "14px",
                  height: "14px",
                  background: "#FF3B00",
                  borderRadius: "50%",
                  fontFamily: "var(--font-mono)",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                }}
              >
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
          </button>

          {/* CTA — desktop only */}
          <Link
            href="/#marketplace"
            className="hidden sm:flex"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "0 1.25rem",
              height: "44px",
              display: "flex",
              alignItems: "center",
              background: "#FF3B00",
              color: "var(--foreground)",
              border: "1px solid #FF3B00",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              minHeight: "unset",
            }}
          >
            Shop Now
          </Link>

          {/* Mobile menu trigger */}
          <MobileNav />
        </div>
      </nav>
    </>
  );
}

// ─── Mobile Slide-in Menu ─────────────────────────────────────────
function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="flex lg:hidden"
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "1px solid var(--border-strong)",
            color: "var(--muted-foreground)",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <MenuIcon size={16} />
        </button>
      </SheetTrigger>

      <SheetContent side="right" showClose={true}>
        {/* Header */}
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "1.25rem",
            paddingRight: "3.5rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--foreground)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                background: "#FF3B00",
                borderRadius: "50%",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            AGED ACCOUNTS
          </span>
        </div>

        {/* Accordion nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          <Accordion type="single" collapsible>
            {mobileSections.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger>{section.name}</AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-1">
                    {section.list.map((link) => (
                      <li key={link.title}>
                        <SheetClose asChild>
                          <NavItemMobile item={link} href={link.href} />
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Direct links below accordion */}
          <div
            style={{
              marginTop: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <SheetClose asChild>
              <a
                href="/#marketplace"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "0.75rem 0.75rem",
                  color: "var(--muted-foreground)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "color 0.2s",
                }}
              >
                Marketplace
              </a>
            </SheetClose>
          </div>
        </div>

        {/* CTA footer */}
        <div
          style={{
            padding: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <SheetClose asChild>
            <a
              href="/#marketplace"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "0.875rem",
                background: "#FF3B00",
                color: "var(--foreground)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                minHeight: "unset",
                transition: "opacity 0.2s",
              }}
            >
              Shop Now →
            </a>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
