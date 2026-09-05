"use client";

import { motion } from "motion/react";
import { ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs";
import { useState } from "react";
import {
  MultiPlayerGameModes,
  SinglePlayerGameModes,
} from "@/lib/GameModesData";
export default function AllModesPage() {
  const [gameType, setGameType] = useState<"sp" | "mp">("sp");

  return (
    <div className="space-y-6 p-3 -pt-20">
      <div className="flex gap-3 justify-start items-center">
        <Link href={"/"}>
          <ChevronLeft size={50}></ChevronLeft>
        </Link>
        <div className="title">All Game Modes</div>
      </div>
      <Tabs
        onValueChange={(e) => {
          setGameType(e as "sp" | "mp");
        }}
        defaultValue={"sp"}
        className=" flex flex-col w-full"
      >
        <TabsList className="w-full bg-white  p-2 rounded-full">
          <TabsTrigger
            value="sp"
            className={`w-full rounded-full p-3 py-5 text-foreground   ${gameType === "sp" && "bg-yellow  shadow-xl"}`}
          >
            Single Player
          </TabsTrigger>
          <TabsTrigger
            value="mp"
            className={`w-full rounded-full p-3 py-5 text-foreground ${gameType === "mp" && "bg-yellow  shadow-xl"}`}
          >
            Multi Player
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sp" className="grid grid-cols-2 gap-2">
          {SinglePlayerGameModes.map((mode, i) => (
            <Link href={"/play/" + mode.slug} key={i.toString()}>
              <motion.button
                whileTap={{
                  scale: 0.95,
                }}
                disabled={mode.disabled}
                className={`rounded-3xl   ${mode.color} h-36 aspect-square w-full flex flex-col justify-center items-center font-semibold text-center gap-5 relative overflow-hidden p-3  `}
              >
                <div className="absolute top-0 left-0 w-full h-full card-bg opacity-10 z-0"></div>
                {mode.disabled && (
                  <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-full flex justify-center items-center bg-black/50 z-99999">
                    <img src="/lock.png" className="w-16 " alt="" />
                  </div>
                )}
                <div className="text-background  z-9999 text-2xl">
                  {mode.title}
                </div>
                <img
                  className="absolute -right-6 -bottom-8 text-background  w-36 z-999  opacity-60"
                  src={mode.img}
                ></img>
              </motion.button>
            </Link>
          ))}
        </TabsContent>
        <TabsContent value="mp" className="grid grid-cols-2 gap-2">
          {MultiPlayerGameModes.map((mode, i) => (
            <Link key={i.toString()} href={"/play/" + mode.slug}>
              <motion.button
                whileTap={{
                  scale: 0.95,
                }}
                disabled={mode.disabled}
                className={`rounded-3xl   ${mode.color} h-36 aspect-square w-full flex flex-col justify-center items-center font-semibold text-center gap-5 relative overflow-hidden p-3  `}
              >
                <div className="absolute top-0 left-0 w-full h-full card-bg opacity-10 z-0"></div>
                {mode.disabled && (
                  <div className=" absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-full flex justify-center items-center bg-black/50 z-99999">
                    <img src="/lock.png" className="w-16 " alt="" />
                  </div>
                )}
                <div className="text-background  z-9999 text-2xl">
                  {mode.title}
                </div>
                <img
                  className="absolute -right-6 -bottom-8 text-background  w-36 z-999  opacity-60"
                  src={mode.img}
                ></img>
              </motion.button>
            </Link>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
