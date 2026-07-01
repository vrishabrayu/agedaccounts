"use client";
import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { GridCard } from "@/components/ui/grid-card";

function NavigationMenu({ className, children, viewport = true, ...props }) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        "group/navigation-menu relative z-10 flex max-w-max flex-1 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuItem({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn("relative", className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({ className, children, ...props }) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(
        "group hover:text-[var(--foreground)] focus:text-[var(--foreground)] data-[state=open]:text-[var(--foreground)] inline-flex w-max items-center justify-center px-4 py-2 text-[10px] font-mono font-bold tracking-[0.15em] uppercase transition-colors outline-none text-[var(--muted-foreground)] disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}{" "}
      <ChevronDownIcon
        className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full md:absolute md:w-auto",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuViewport({ className, ...props }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 isolate z-50 flex justify-center">
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          "origin-top-center data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-2 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden md:w-[var(--radix-navigation-menu-viewport-width)]",
          "bg-[var(--popover)] border border-[var(--border)] shadow-2xl backdrop-blur-xl",
          className
        )}
        {...props}
      />
    </div>
  );
}

function NavigationMenuLink({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "hover:text-[var(--foreground)] focus:text-[var(--foreground)] flex flex-col justify-center gap-1 px-4 py-2 text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-[var(--muted-foreground)] transition-colors outline-none",
        className
      )}
      {...props}
    />
  );
}

function NavigationMenuIndicator({ className, ...props }) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="bg-[var(--border-strong)] relative top-[60%] h-2 w-2 rotate-45 shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  );
}

/* ── Specialised nav item variants ── */

function NavGridCard({ link, ...props }) {
  return (
    <NavigationMenuPrimitive.Link asChild href={link.href}>
      <GridCard {...props}>
        {link.icon && (
          <link.icon
            className="relative size-5"
            style={{ color: "var(--muted-foreground)" }}
          />
        )}
        <div className="relative mt-3">
          <span
            className="text-sm font-mono font-bold"
            style={{ color: "var(--foreground)" }}
          >
            {link.title}
          </span>
          {link.description && (
            <p
              className="mt-1 text-xs font-sans leading-snug"
              style={{ color: "var(--filter-inactive)" }}
            >
              {link.description}
            </p>
          )}
        </div>
      </GridCard>
    </NavigationMenuPrimitive.Link>
  );
}

function NavSmallItem({ item, className, href, ...props }) {
  return (
    <NavigationMenuLink
      href={href}
      className={cn(
        "group relative h-max flex-row items-center gap-x-3 px-3 py-2 rounded-none hover:bg-[var(--input)]",
        className
      )}
      {...props}
    >
      {item.icon && (
        <item.icon
          className="size-4 flex-shrink-0"
          style={{ color: "var(--muted-foreground)" }}
        />
      )}
      <p
        className="text-[11px] font-mono font-bold tracking-[0.12em] uppercase"
        style={{ color: "var(--muted-foreground)" }}
      >
        {item.title}
      </p>
      <div className="relative ml-auto flex h-full w-4 items-center">
        <ArrowRightIcon
          className="size-3 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
          style={{ color: "#FF3B00" }}
        />
      </div>
    </NavigationMenuLink>
  );
}

function NavLargeItem({ link, className, href, ...props }) {
  return (
    <NavigationMenuLink
      href={href}
      className={cn(
        "group relative flex flex-col justify-center border border-[var(--border)] p-0 hover:border-[var(--border-strong)] hover:bg-[var(--stat-bg)]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="space-y-0.5">
          <span
            className="text-[11px] font-mono font-bold tracking-[0.12em] uppercase leading-none"
            style={{ color: "var(--foreground)" }}
          >
            {link.title}
          </span>
          {link.description && (
            <p
              className="line-clamp-1 text-[10px] font-sans leading-snug"
              style={{ color: "var(--text-subtle)" }}
            >
              {link.description}
            </p>
          )}
        </div>
        {link.icon && (
          <link.icon
            className="size-4 flex-shrink-0"
            style={{ color: "var(--text-faint)" }}
          />
        )}
      </div>
    </NavigationMenuLink>
  );
}

function NavItemMobile({ item, className, href, ...props }) {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex gap-x-3 rounded-none p-3 text-sm transition-colors hover:bg-[var(--input)]",
        className
      )}
      {...props}
    >
      <div className="flex size-10 items-center justify-center border border-[var(--border)] bg-[var(--input)] flex-shrink-0">
        {item.icon && (
          <item.icon
            className="size-4"
            style={{ color: "var(--muted-foreground)" }}
          />
        )}
      </div>
      <div className="flex flex-col justify-center">
        <p
          className="text-[11px] font-mono font-bold tracking-[0.12em] uppercase"
          style={{ color: "var(--foreground)" }}
        >
          {item.title}
        </p>
        {item.description && (
          <span
            className="line-clamp-1 text-[10px] font-sans leading-snug mt-0.5"
            style={{ color: "var(--text-subtle)" }}
          >
            {item.description}
          </span>
        )}
      </div>
    </a>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  NavGridCard,
  NavSmallItem,
  NavLargeItem,
  NavItemMobile,
};
