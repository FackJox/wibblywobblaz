import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { Providers, DevProviders } from "./providers";
export const metadata: Metadata = {
  title: "Wibbly Wobblaz",
  description: "A sound and cultural experiment, gone wobbly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Providers>
          <DevProviders>
            {children}
          </DevProviders>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
