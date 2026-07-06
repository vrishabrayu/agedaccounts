# Aged Accounts — Frontend

> A high-performance, dark-themed social media account marketplace built with **Next.js 14**, featuring animated UI, mobile-first design, and a fully interactive storefront experience.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0055?style=flat-square)
![License](https://img.shields.io/badge/license-Private-red?style=flat-square)

---

## Overview

This is the **frontend repository** for the Aged Accounts marketplace. It handles all UI, animations, routing, and client-side state. Backend integration (payments, database) is handled separately.

**Key Features:**
- 🌑 Dark, sharp aesthetic with monospace typography and orange accent
- 🎬 Smooth animations via Framer Motion and GSAP
- 🛒 Full cart flow — add, remove, manage quantities, and checkout
- 🧭 Responsive navigation with mobile slide-in sheet
- 📱 Mobile-first — optimised for iOS and Android browsers
- ✍️ Blog section with in-depth articles on account management

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework & routing |
| React 18 | UI rendering |
| Tailwind CSS 3.4 | Utility-first styling |
| Framer Motion 12 | Scroll animations (testimonials) |
| GSAP 3.15 | Cart drawer & card animations |
| Radix UI | Accessible headless primitives |
| Lucide React | Icon library |
| Three.js | WebGL hero canvas |
| CVA + clsx | Component variant management |

---

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── layout.js           # Root layout
│   ├── page.js             # Homepage
│   ├── globals.css         # Global styles & design tokens
│   ├── about/              # About page
│   ├── support/            # Support & FAQ page
│   └── blog/               # Blog articles
│
├── components/             # React components
│   ├── Navbar.js           # Top navigation bar
│   ├── AccountCard.js      # Product listing card
│   ├── CartDrawer.js       # Slide-in cart panel
│   ├── CartToast.js        # Cart notification toast
│   ├── CheckoutModal.js    # Checkout flow modal
│   ├── FilterMenu.js       # Platform filter pills
│   ├── Hero.js             # Hero section
│   └── ui/                 # Reusable UI primitives
│
├── context/
│   └── CartContext.js      # Global cart state (React Context)
│
├── data/
│   └── mockAccounts.js     # Product catalogue data
│
└── lib/
    └── utils.js            # Shared utility helpers
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/vrishabrayu/agedaccounts.git
cd agedaccounts

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in the required values in .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

> **Never commit `.env.local` to version control.** Contact the project owner for the required credentials.

---

## Scripts

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Build production bundle
npm run start    # Serve production build
npm run lint     # Run ESLint
```

---

## Contributing

This is a private project with a defined contributor team.

### Workflow

1. **Sync with upstream** before making any changes:
   ```bash
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a feature branch** — never commit directly to `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Scope your changes** — this repo is frontend only. Do not add backend logic, API secrets, or server-side code.

4. **Stage only intended files:**
   ```bash
   git add <specific-file(s)>
   git status   # verify before committing
   ```

5. **Commit with a clear message:**
   ```bash
   git commit -m "feat: describe what you changed"
   ```

6. **Push and open a Pull Request:**
   ```bash
   git push origin feat/your-feature-name
   ```
   Then open a PR against `main` on GitHub and request a review.

### Commit Message Convention

| Prefix | When to use |
|---|---|
| `feat:` | New feature or component |
| `fix:` | Bug fix |
| `style:` | Visual/CSS-only changes |
| `refactor:` | Code restructure, no behaviour change |
| `docs:` | Documentation updates |
| `chore:` | Dependency updates, config changes |

---

## Design Tokens

The design system is defined in `app/globals.css` and extended in `tailwind.config.js`.

| Token | Value | Use |
|---|---|---|
| `--background` | `#0D0D0D` | Page background |
| `--foreground` | `#EFEFE9` | Primary text |
| `--accent-color` | `#FF3B00` | Orange accent |
| `--card` | `#1A1A1A` | Card surfaces |
| `--border` | `rgba(239,239,233,0.10)` | Subtle borders |
| `--font-mono` | `Space Mono` | Headings & labels |
| `--font-sans` | `Inter` | Body text |

---

## License

Private — all rights reserved.
