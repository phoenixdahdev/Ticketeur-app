import type { Metadata } from "next"

import "@ticketur/ui/globals.css"

export const metadata: Metadata = {
  title: "Ticketur",
  description: "Ticketur",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
