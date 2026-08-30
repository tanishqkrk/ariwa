import type { Metadata } from "next";
import "./globals.css";
import {
  Geist,
  Geist_Mono,
  Poppins,
  Press_Start_2P,
  Rubik,
  Fredoka,
  Google_Sans,
  Geom,
  IBM_Plex_Mono,
  Space_Grotesk,
  Urbanist,
  Unbounded,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { GameDataProvider } from "@/context/GameDataContext";

const poppins = Unbounded({
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WordRush — Guess. Think. Win.",
  description:
    "A fast-paced word guessing game where every guess matters. Find the word, build your streak, and climb the ranks.",
  openGraph: {
    title: "WordRush — Guess. Think. Win.",
    description: "Find the word. Build your streak. Climb the ranks.",
    type: "website",
    siteName: "WordRush",
  },
  twitter: {
    card: "summary_large_image",
    title: "WordRush — Guess. Think. Win.",
    description: "Find the word. Build your streak. Climb the ranks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="bg-background  overflow-x-hidden text-foreground "
      lang="en"
    >
      <GameDataProvider>
        <body className={`${poppins.className} antialiased h-dvh`}>
          <Navbar></Navbar>
          <main className="">{children}</main>
        </body>
      </GameDataProvider>
    </html>
  );
}
