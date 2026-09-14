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
  Google_Sans_Flex,
} from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { GameDataProvider } from "@/context/GameDataContext";

const poppins = Unbounded({
  weight: ["400", "500", "600", "700"],
  variable: "--font-unbounded-sans",
});
const google_sane = Google_Sans_Flex({
  weight: ["400", "500", "600", "700"],
  variable: "--font-google-sans",
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
      className="overflow-x-hidden dark  bg-background   text-foreground dark:text-background   dark:bg-foreground"
      lang="en"
    >
      <GameDataProvider>
        <body
          className={`${poppins.className} ${google_sane.className} antialiased h-dvh `}
        >
          <Navbar></Navbar>
          <main className="font-unbounded-sans">{children}</main>
        </body>
      </GameDataProvider>
    </html>
  );
}
