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
const poppins = Unbounded({
  weight: ["400", "500", "600", "700", "200", "300", "800", "900"],
  variable: "--font-unbounded-sans",
});

const google_sane = Google_Sans_Flex({
  weight: [
    "1",
    "400",
    "500",
    "600",
    "700",
    "100",
    "200",
    "300",
    "800",
    "900",
    "1000",
  ],
  variable: "--font-google-sans",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="overflow-x-hidden   bg-background   text-foreground dark:text-background   dark:bg-foreground"
      lang="en"
    >
      <GameDataProvider>
        <body
          className={`${google_sane.variable} ${poppins.variable}   antialiased h-dvh `}
        >
          <Navbar></Navbar>
          <main className="font-unbounded">{children}</main>
        </body>
      </GameDataProvider>
    </html>
  );
}
