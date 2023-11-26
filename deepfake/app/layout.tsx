import { ThemeProvider } from "@/components/theme-provider";
import { caption, inter } from "@/lib/utils/typography";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polyp HUB",
  description: "Discover our solutions for the Junction X Budapest hackathon",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, caption.variable)}>
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
