import { ReactNode } from "react";

// Root layout: html/body are defined in [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
