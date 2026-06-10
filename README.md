# Aged Accounts Store

> **Premium social media account marketplace** — hand-farmed, aged, and verified social media assets with instant delivery and secure checkout.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square)
![License](https://img.shields.io/badge/license-Private-red?style=flat-square)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Data Schema](#data-schema)
- [Component Architecture](#component-architecture)
- [Design System](#design-system)
- [Cart & State Management](#cart--state-management)
- [Pages](#pages)
- [Integrating Stripe](#integrating-stripe-next-step)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)

---

## Overview

Aged Accounts Store is a Next.js 14 App Router e-commerce storefront for buying and selling aged social media accounts. It features:

- **WebGL shader hero** with animated rotating brand keyword
- **Shadcn-style navigation menu** with platform dropdowns and mobile slide-in sheet
- **Cart drawer** with quantity management and GSAP animations
- **Checkout modal** with Stripe and crypto placeholders (ready to wire up)
- **Testimonials** with animated scroll columns
- **Mobile-first** — safe-area insets, 44px touch targets, iOS-optimised meta

---

## Tech Stack

### Runtime Dependencies

| Package | Version | Purpose |
|---|---|---|
| `next` | 14.2.x | App Router framework |
| `react` / `react-dom` | ^18 | UI layer |
| `framer-motion` | ^12 | Testimonials scroll animation |
| `gsap` | ^3.15 | Cart drawer / card scroll animations |
| `lucide-react` | ^1.17 | Icon library |
| `@radix-ui/react-navigation-menu` | ^1.2 | Accessible nav menu primitive |
| `@radix-ui/react-dialog` | ^1.1 | Sheet / modal primitive |
| `@radix-ui/react-accordion` | ^1.2 | Mobile menu accordion |
| `@radix-ui/react-label` | ^2.1 | Form label primitive |
| `@radix-ui/react-separator` | ^1.1 | Divider primitive |
| `@radix-ui/react-slot` | ^1.2 | `asChild` pattern for buttons |
| `class-variance-authority` | ^0.7 | Button / component variants |
| `clsx` | ^2.1 | Conditional className merging |
| `tailwind-merge` | ^3.6 | Tailwind class deduplication |

### Dev Dependencies

| Package | Purpose |
|---|---|
| `tailwindcss` ^3.4 | Utility CSS framework |
| `postcss` + `autoprefixer` | CSS processing |
| `eslint` + `eslint-config-next` | Linting |

---

## Project Structure

```
fastaccounts-store/
├── app/
│   ├── layout.js           # Root layout — Navbar, Footer, Cart, Toast
│   ├── page.js             # Homepage — Hero, Marketplace, Testimonials
│   ├── globals.css         # Design system tokens + global resets
│   ├── about/
│   │   └── page.js         # About Us page
│   └── support/
│       └── page.js         # Support & FAQ page
│
├── components/
│   ├── Navbar.js           # Navigation — desktop menu + mobile Sheet
│   ├── AccountCard.js      # Product card — platform icon, stats, add-to-cart
│   ├── CartDrawer.js       # Slide-in cart drawer (GSAP)
│   ├── CartToast.js        # "Products will be e-mailed" bottom toast
│   ├── CheckoutModal.js    # Checkout flow (Stripe/crypto placeholders)
│   ├── FilterMenu.js       # Platform filter pills
│   ├── Footer.js           # Site footer wrapper
│   ├── Hero.js             # Hero section wrapper
│   │
│   └── ui/                 # Shadcn-style primitives
│       ├── navigation-menu.jsx    # NavMenu + NavGridCard + NavSmallItem etc.
│       ├── sheet.jsx              # Radix Dialog-based slide panel
│       ├── accordion.jsx          # Radix Accordion
│       ├── button.jsx             # CVA-based button
│       ├── grid-card.jsx          # Animated grid card with glow
│       ├── grid-pattern.jsx       # SVG grid pattern background
│       ├── animated-hero.jsx      # Spring-animated headline + rotating word
│       ├── shader-lines.jsx       # WebGL Three.js shader canvas
│       ├── site-footer.jsx        # Full footer with links, socials
│       └── testimonials-columns.jsx  # Framer Motion infinite scroll columns
│
├── context/
│   └── CartContext.js      # Global cart state + toast notifications
│
├── data/
│   └── mockAccounts.js     # Product catalogue (replace with DB/API)
│
├── lib/
│   └── utils.js            # cn() helper (clsx + tailwind-merge)
│
├── next.config.mjs         # Image remotePatterns config
├── tailwind.config.js      # Tailwind theme + accordion keyframes
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or `yarn` / `pnpm`)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/VeniVedant/fastaccounts-store.git
cd fastaccounts-store

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Data Schema

Products are defined in [`data/mockAccounts.js`](./data/mockAccounts.js). Each account object follows this schema:

```js
{
  id:          number,   // Unique product identifier
  platform:    string,   // "Instagram" | "TikTok" | "YouTube" | "Twitter" |
                         // "Reddit" | "Discord" | "Snapchat" | "Facebook"
  niche:       string,   // Content category (e.g. "Fitness", "Gaming")
  followers:   string,   // Formatted count (e.g. "125k", "50k Karma", "200k Views")
  engagement:  string,   // Engagement rate (e.g. "4.2%") or "N/A" / "High"
  price:       number,   // Price in USD (integer)
}
```

### Example Entry

```js
{
  id: 1,
  platform: "Instagram",
  niche: "Fitness",
  followers: "125k",
  engagement: "4.2%",
  price: 65,
}
```

### Adding / Updating Products

Edit `data/mockAccounts.js` directly, or replace it with a dynamic data fetch:

```js
// Example: fetch from your API instead
export async function getAccounts() {
  const res = await fetch("https://your-api.com/accounts");
  return res.json();
}
```

> **Note:** When Stripe is integrated, `price` should map to a Stripe Price ID. See [Integrating Stripe](#integrating-stripe-next-step).

---

## Component Architecture

### Cart State — `CartContext`

All cart operations flow through `context/CartContext.js`. Wrap your app in `<CartProvider>` (already done in `layout.js`).

```js
import { useCart } from "@/context/CartContext";

const {
  cart,              // Array of cart items: { ...account, quantity: number }
  addToCart,         // (account) => void — adds 1 unit, fires toast
  addMultipleToCart, // (accounts[]) => void — bulk add, fires toast
  removeFromCart,    // (id) => void
  updateQuantity,    // (id, newQty) => void — removes if qty < 1
  clearCart,         // () => void
  cartTotal,         // number — sum of (price * quantity)
  cartItemCount,     // number — total units in cart
  isDrawerOpen,      // boolean
  setIsDrawerOpen,   // setter
  toggleDrawer,      // () => void
  isCheckoutOpen,    // boolean
  setIsCheckoutOpen, // setter
  toast,             // string | null — current toast message
} = useCart();
```

### Cart Item Shape

```js
{
  id:         number,
  platform:   string,
  niche:      string,
  followers:  string,
  engagement: string,
  price:      number,
  quantity:   number,  // added by CartContext
}
```

Cart is persisted to `localStorage` under the key `agedaccounts-cart`.

### Navigation Menu — `components/ui/navigation-menu.jsx`

Built on `@radix-ui/react-navigation-menu`. Exports:

| Export | Use |
|---|---|
| `NavigationMenu` | Root container |
| `NavigationMenuList` | Horizontal list wrapper |
| `NavigationMenuItem` | Individual item |
| `NavigationMenuTrigger` | Dropdown trigger button |
| `NavigationMenuContent` | Dropdown panel |
| `NavigationMenuLink` | Accessible link |
| `NavGridCard` | Large card with animated grid bg |
| `NavSmallItem` | Compact list item with arrow |
| `NavLargeItem` | Medium item with icon + description |
| `NavItemMobile` | Icon + title + description for Sheet |

### Sheet (Mobile Nav) — `components/ui/sheet.jsx`

Wraps `@radix-ui/react-dialog`. Used by `MobileNav` in `Navbar.js`.

```jsx
<Sheet>
  <SheetTrigger asChild><button>Open</button></SheetTrigger>
  <SheetContent side="right">
    <SheetClose asChild><button>Close</button></SheetClose>
    {/* content */}
  </SheetContent>
</Sheet>
```

### Toast — `components/CartToast.js`

Reads `toast` from `CartContext` and renders a fixed bottom notification. No external library needed.

---

## Design System

Tokens are defined as CSS variables in [`app/globals.css`](./app/globals.css):

```css
:root {
  --background:        #0D0D0D;   /* void black */
  --foreground:        #EFEFE9;   /* warm white */
  --card:              #1A1A1A;
  --primary:           #EFEFE9;
  --primary-foreground:#0D0D0D;
  --secondary:         #2A2A2A;
  --muted:             #1A1A1A;
  --muted-foreground:  rgba(239,239,233,0.45);
  --accent-color:      #FF3B00;   /* velocity orange — used sparingly */
  --border:            rgba(239,239,233,0.10);
  --ring:              rgba(239,239,233,0.30);
  --popover:           #0F0F0F;
  --radius:            0px;       /* sharp corners — no border-radius */
  --font-mono:         'Space Mono', monospace;
  --font-sans:         'Inter', sans-serif;
  --navbar-height:     72px;
}
```

Tailwind tokens mirror these variables via `tailwind.config.js`. Use standard Tailwind classes like `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `app/page.js` | Homepage: Hero → Marketplace → Testimonials |
| `/about` | `app/about/page.js` | About Us with feature grid |
| `/support` | `app/support/page.js` | Help centre with FAQ accordion |

---

## Integrating Stripe (Next Step)

Stripe and database hookup is pending. When ready:

1. **Install Stripe**
   ```bash
   npm install stripe @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Add environment variables** (see below)

3. **Create a checkout API route** at `app/api/checkout/route.js`:
   ```js
   import Stripe from "stripe";
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

   export async function POST(req) {
     const { items } = await req.json();
     const session = await stripe.checkout.sessions.create({
       line_items: items.map(item => ({
         price_data: {
           currency: "usd",
           unit_amount: item.price * 100,
           product_data: { name: `${item.platform} — ${item.niche}` },
         },
         quantity: item.quantity,
       })),
       mode: "payment",
       success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
       cancel_url: `${process.env.NEXT_PUBLIC_URL}/`,
     });
     return Response.json({ url: session.url });
   }
   ```

4. **Update `CheckoutModal.js`** — replace the placeholder `setPaymentNotice(...)` with a call to your `/api/checkout` route.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Stripe (add when integrating payment)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Your deployed domain (used for Stripe redirect URLs)
NEXT_PUBLIC_URL=https://your-domain.com

# Database (add when moving away from mockAccounts.js)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

> ⚠️ Never commit `.env.local` — it is already listed in `.gitignore`.

---

## Scripts

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Build for production (outputs to .next/)
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

---

## Contributing

This is a private project. For changes:

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes
3. Commit with a descriptive message
4. Push and open a Pull Request against `main`

---

## License

Private — all rights reserved. Not open source.
