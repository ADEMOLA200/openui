import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tangential — Project Tracker",
  description: "A Linear-inspired project tracking demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
