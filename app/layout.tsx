import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { ClientProviders } from "@/components/providers";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const calcom = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-display",
});

const advent = localFont({
  src: "../assets/fonts/Christmas.otf",
  variable: "--font-advent",
});

export const metadata: Metadata = {
  title: "Visual Advent of Code",
  description: "My answers to 2023's advent of code visualized",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClientProviders>
        <body
          className={cn(
            inter.className,
            calcom.variable,
            advent.variable,
            "flex flex-col"
          )}
        >
          {children}
        </body>
      </ClientProviders>
    </html>
  );
}
