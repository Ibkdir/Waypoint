import "~/styles/globals.css";

import { Analytics } from '@vercel/analytics/react';
import { Inter } from "next/font/google";
import { siteConfig } from "~/lib/siteConfig";
import { EndpointsContext } from "./agent";
import { type ReactNode } from "react";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [{ rel: "icon", url: "/compass-light.svg" }],
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body>
        <Providers>
          <div>
            <EndpointsContext>{props.children}</EndpointsContext>
            <Analytics />
          </div>
        </Providers>
      </body>
    </html>
  );
}