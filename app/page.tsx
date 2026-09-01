"use client";

import Autoplay from "embla-carousel-autoplay";
import Navbar from "@/components/Navbar";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Carousel";
import { ChevronRight, Gamepad2, Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  GameModeDisplay,
  MultiPlayerGameModes,
  SinglePlayerGameModes,
} from "@/lib/GameModesData";

function QuickPlayCard({ mode }: { mode: GameModeDisplay }) {
  return (
    <div
      className={`rounded-4xl w-5/6 h-full border-4 relative overflow-hidden flex flex-col justify-between items-center gap-3  p-6  ${mode.color}`}
    >
      <div className="space-y-3 z-99 flex flex-col justify-center items-center">
        <div className="text-2xl text-center z-99 font-semibold">
          {mode.title}
        </div>
        <div className="text-center text-sm z-99  ">{mode.description}</div>
      </div>
      <div className="flex justify-center items-center">
        <mode.icon size={160} className=" text-background "></mode.icon>
      </div>
      <Link href={"/play/" + mode.slug} className="w-full">
        <motion.button
          whileTap={{
            scale: 0.97,
          }}
          disabled={mode.disabled}
          className="border-2 border-foreground bg-foreground text-background p-3 py-4 z-999 rounded-full w-full flex items-center justify-center gap-2 hover:bg-background hover:text-foreground capitalize disabled:opacity-50 text-sm"
        >
          {mode.disabled ? "Coming soon" : mode.cta}{" "}
          <ChevronRight></ChevronRight>
        </motion.button>
      </Link>
    </div>
  );
}

export default function Page() {
  return (
    <main className="space-y-8 flex-col flex justify-between min-h-[calc(100dvh)] p-3 pt-[8rem]">
      <div className="space-y-8 flex flex-col justify-between h-full">
        <div className="title">Quick Play</div>
        <div id="quickGames" className="relative">
          <Carousel
            className=""
            opts={{
              loop: true,
              align: "center",
              slidesToScroll: 1,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselNext className="absolute  right-2  z-999999"></CarouselNext>
            <CarouselPrevious className="absolute  left-2 z-9999"></CarouselPrevious>
            <CarouselContent className="min-h-96">
              {[
                ...SinglePlayerGameModes.slice(0, 3),
                ...MultiPlayerGameModes.slice(0, 2),
              ].map((mode, i) => {
                return (
                  <CarouselItem
                    key={mode.id}
                    className="flex justify-center items-center"
                  >
                    <QuickPlayCard mode={mode} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
        <div></div>
      </div>
      <div className="rounded-full bg-foreground w-full p-4 text-sm flex gap-3 justify-center items-center">
        <div className="bg-background text-foreground  p-1 rounded-full flex justify-center items-center aspect-square w-12">
          <ShoppingCart strokeWidth={2}></ShoppingCart>
        </div>
        <div className="bg-background text-foreground  p-1 rounded-full flex justify-center items-center aspect-square w-12">
          <Search strokeWidth={2}></Search>
        </div>
        <Link href="/all-modes">
          <motion.div
            whileTap={{
              scale: 0.95,
            }}
            className="bg-green w-fit p-3 rounded-full text-background flex justify-center items-center gap-2 "
          >
            <Gamepad2></Gamepad2> <span>All Game Modes</span>
          </motion.div>
        </Link>
      </div>
    </main>
  );
}
