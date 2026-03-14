import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ background: "#065f46", color: "white", padding: "1rem" }}>
          <nav style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/">Home</Link>
            <Link href="/mosques">Directory</Link>
            <Link href="/map">Map</Link>
            <Link href="/add">Add Mosque</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
