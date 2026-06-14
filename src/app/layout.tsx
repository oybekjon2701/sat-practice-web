import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "satzone. — SAT Practice Tests",
  description: "Bluebook-style SAT practice test platform",
  metadataBase: new URL("https://www.satpractice.uz"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "satzone. — SAT Practice Tests",
    description: "Bluebook-style SAT practice test platform",
    type: "website",
    siteName: "satzone.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
