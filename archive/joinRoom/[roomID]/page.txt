"use client";

import MultiPlayerTrialMode from "@/archive/MultiPlayerTrialMode";
import { MultiPlayerDataProvider } from "@/archive/MultiPlayerDataContext";
import { useParams } from "next/navigation";

export default function joinRoomWithIDPage() {
  return (
    <>
      <MultiPlayerDataProvider>
        <MultiPlayerTrialMode></MultiPlayerTrialMode>
      </MultiPlayerDataProvider>
    </>
  );
}
