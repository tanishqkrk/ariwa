"use client";

import Navbar from "@/components/Navbar";
import { SinglePlayerDataProvider } from "@/context/GameDataContext";
import dynamic from "next/dynamic";

const SinglePlayerTrialModeSSR = dynamic(
  () => import("@/components/GameModes/SinglePlayerTrialMode"),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center text-white text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="loader"></div>
      </div>
    ),
  },
);

export default function Home() {
  return (
    <>
      <SinglePlayerTrialModeSSR />
    </>
  );
}
