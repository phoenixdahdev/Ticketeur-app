import "./globals.css";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { DefaultProvider } from "@ticketur/ui/providers/default-provider";

export const metadata: Metadata = {
  title: {
    default: "Ticketur",
    template: "%s | Ticketur",
  },
  description: "Ticketur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <NuqsAdapter>
        <DefaultProvider useLens={true} trpcUrl="/api/trpc">
          <body>{children}</body>
        </DefaultProvider>
      </NuqsAdapter>
    </html>
  );
}
