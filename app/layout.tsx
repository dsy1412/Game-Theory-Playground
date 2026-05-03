import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Game Theory Playground",
  description: "Learn strategic thinking through interactive visual simulations."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
