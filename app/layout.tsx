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
  title: "WordRush — The Word Game That Keeps You Guessing",
  description:
    "Guess words, build streaks, and prove your vocabulary in WordRush — a fast, addictive word game where every guess counts.",
  keywords: [
    "WordRush",
    "word game",
    "word guessing game",
    "vocabulary game",
    "daily word game",
    "word puzzle",
    "guess the word",
  ],
  openGraph: {
    title: "WordRush — The Word Game That Keeps You Guessing",
    description:
      "Guess words, build streaks, and prove your vocabulary. How long can you keep your streak alive?",
    type: "website",
    siteName: "WordRush",
  },
  twitter: {
    card: "summary_large_image",
    title: "WordRush — The Word Game That Keeps You Guessing",
    description:
      "Guess words, build streaks, and prove your vocabulary. How long can you keep your streak alive?",
  },
  robots: {
    index: true,
    follow: true,
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
