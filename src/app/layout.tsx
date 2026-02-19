import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FirstOp — Internships for Students",
  description: "FirstOp connects students with real internship and co-op opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}