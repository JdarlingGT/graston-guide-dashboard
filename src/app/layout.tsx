import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Graston Guide Dashboard",
  description: "Internal staff dashboard for managing training events, student rosters, and compliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
