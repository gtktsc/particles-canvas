import type { ReactNode } from "react";
import "./globals.css";
import { AppProviders } from "@/app/providers";
import { buildPageMetadata } from "@/lib/metadata";
import { baseTheme } from "@/theme/theme";
import { createCssVariables } from "@/theme/utils";

export const metadata = buildPageMetadata();
const themeVariables = createCssVariables(baseTheme);

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html data-theme={baseTheme.mode} lang="en" style={themeVariables}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
