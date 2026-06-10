import "./globals.css";

export const metadata = {
  title: "Fast Accounts | Premium Social Media Marketplace",
  description:
    "Acquire top-tier social media assets. Premium accounts, instant delivery, secure checkout.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
