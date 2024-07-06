import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { siteConfig } from "~/lib/siteConfig";
import { EndpointsContext } from "./agent";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: [{ rel: "icon", url: "/" }],
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body>
        <div>
          <EndpointsContext>{props.children}</EndpointsContext>
        </div>
      </body>
    </html>
  );
}