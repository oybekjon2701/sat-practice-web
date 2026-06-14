import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
        <body className={`${inter.className} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
