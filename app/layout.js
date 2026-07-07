import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata = {
  title: "Aged Accounts | Premium Social Media Marketplace",
  description:
    "Acquire top-tier social media assets. Premium accounts, instant delivery, secure checkout.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aged Accounts",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#EFEFE9",
};

const themeScript = `(function(){try{var t=localStorage.getItem("agedaccounts-theme");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
