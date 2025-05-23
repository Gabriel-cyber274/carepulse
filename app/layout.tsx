import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./otp.css";
import "./landing.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

// export const metadata: Metadata = {
//   title: "ViePulse",
//   description: "A patient management system",
// };
export const metadata: Metadata = {
  title: "ViePulse",
  description: "A patient management system",
  openGraph: {
    title: "ViePulse",
    description: "A patient management system",
    url: "https://www.viepulse.com",
    siteName: "ViePulse",
    type: "website",
    images: [
      {
        // url: "/favicon.ico",
        url: "/LOGO.svg",
        width: 1200,
        height: 630,
        alt: "ViePulse",
      },
    ],
  },
  icons: {
    // icon: "/favicon.ico",
    icon: "/LOGO.svg",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-dark-300 font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
