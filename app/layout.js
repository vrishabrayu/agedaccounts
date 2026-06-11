import "./globals.css";

export const metadata = {
  title: "Fast Accounts | Premium Social Media Marketplace",
  description:
    "Acquire top-tier social media assets. Premium accounts, instant delivery, secure checkout.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fast Accounts",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0D0D0D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
