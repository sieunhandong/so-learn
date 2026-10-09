import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "So-Learn — Học Toán Vui",
  description: "Web học toán tương tác dành cho học sinh tiểu học lớp 1–5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
