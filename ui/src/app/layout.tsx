import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import { Providers } from "@/app/Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Media Scrapper",
  description: "Media Scrapper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ConfigProvider>
            {children}
          </ConfigProvider>
        </Providers>
      </body>
    </html>
  );
}
