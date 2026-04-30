import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Willbanks Metals — Customer Portal",
  description:
    "Willbanks Metals Customer Portal — Track orders, manage quotes, and view invoices for your metal fabrication projects.",
  keywords: ["metal fabrication", "order tracking", "customer portal", "steel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700&family=Barlow:wght@300;400;500&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#2c3347",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#eef1f5",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "14px",
              letterSpacing: "0.04em",
            },
          }}
        />
      </body>
    </html>
  );
}
