import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import Providers from "@/components/Providers";
import "react-loading-skeleton/dist/skeleton.css"
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster"
import 'simplebar-react/dist/simplebar.min.css'

export const metadata: Metadata = {
  title: "Geni AI | A super fast pdf analazer with chatGPT",
  description: "A super fast pdf analazer with chatGPT to enhance your productivity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={cn(
            "min-h-screen font-sans antialiased grainy",
            inter.className
          )}
        >
          <Header />
          <Toaster/>
          {children}
        </body>
      </Providers>
    </html>
  );
}
