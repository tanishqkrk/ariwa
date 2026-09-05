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
import {
  ChevronRight,
  Gamepad2,
  Search,
  ShoppingCart,
  // @ts-expect-error add types later ig
  Podium,
} from "lucide-react";
import Link from "next/link";
import {
  GameModeDisplay,
  MultiPlayerGameModes,
  SinglePlayerGameModes,
} from "@/lib/GameModesData";

function QuickPlayCard({ mode }: { mode: GameModeDisplay }) {
  return (
    <div
      className={`rounded-4xl w-full --border-4 h-full  relative overflow-hidden flex flex-col justify-between items-center gap-3  p-6   ${mode.color}`}
    >
      <div className="absolute top-0 left-0 w-full h-full card-bg opacity-10 z-0"></div>
      <div className="space-y-3 flex flex-col justify-center items-center text-white z-99999">
        <div className="text-2xl text-center z-99999 font-semibold">
          {mode.title}
        </div>
        <div className="text-center text-sm z-99999  ">{mode.description}</div>
      </div>
      <div className="flex justify-center items-center z-99999">
        {mode.img ? (
          <img className="w-56 scale-115" src={mode.img}></img>
        ) : (
          <mode.icon size={160} className=" text-background "></mode.icon>
        )}
      </div>
      <Link href={"/play/" + mode.slug} className="w-full z-99999">
        <motion.button
          whileTap={{
            scale: 0.97,
          }}
          disabled={mode.disabled}
          className="border-2 shadow-xl shadow-black/40 border-foreground bg-foreground text-background p-3 py-4 z-999 rounded-full w-full flex items-center justify-center gap-2 hover:bg-background hover:text-foreground capitalize disabled:opacity-80 text-sm"
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
    <main className="space-y-8 flex-col flex justify-between --min-h-[calc(100dvh)] py-3 --pt-20">
      <div className="space-y-8 flex flex-col justify-between h-full ">
        <div className="title px-3">Quick Play</div>
        <div id="quickGames" className="relative">
          <Carousel
            className=""
            opts={{
              loop: true,
              align: "center",

              // slidesToScroll: 1,
            }}
            plugins={[
              Autoplay({
                // delay: 200000,
                delay: 2000,
              }),
            ]}
          >
            <CarouselNext className="absolute  right-2  z-999999 scale-150 shadow-lg border-0 shadow-black"></CarouselNext>
            <CarouselPrevious className="absolute  left-2  z-999999 scale-150 shadow-lg border-0 shadow-black"></CarouselPrevious>
            <CarouselContent className="min-h-96">
              {[
                ...SinglePlayerGameModes.slice(0, 3),
                ...MultiPlayerGameModes.slice(0, 2),
              ].map((mode, i) => {
                return (
                  <CarouselItem
                    key={mode.id}
                    className="flex justify-center items-center basis-4/5"
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
      <div className="px-3 flex justify-center items-center">
        <div className="rounded-full bg-foreground w-full p-2 px-3 text-sm flex gap-3 justify-between items-center ">
          <div className=" flex justify-start items-center gap-2">
            <motion.button
              whileTap={{
                scale: 0.91,
              }}
              className="bg-linear-to-r from-background to-yellow-50 to- text-foreground  p-1 rounded-full flex justify-center items-center aspect-square w-12"
            >
              <img src="/shop.png" className="w-8" alt="" />
            </motion.button>
            <motion.button
              whileTap={{
                scale: 0.91,
              }}
              className="bg-linear-to-r from-background to-yellow-50 text-foreground  p-1 rounded-full flex justify-center items-center aspect-square w-12"
            >
              <img src="/search2.png" className="w-8 " alt="" />
            </motion.button>
            <motion.button
              whileTap={{
                scale: 0.91,
              }}
              className="bg-linear-to-r from-background to-yellow-50 text-foreground  p-1 rounded-full flex justify-center items-center aspect-square w-12"
            >
              <img src="/trophy2.png" className="w-8" alt="" />
            </motion.button>
          </div>
          <Link href="/all-modes">
            <motion.div
              whileTap={{
                scale: 0.95,
              }}
              className="bg-linear-to-r to-emerald-500 from-green-600 w-fit p-3 rounded-full text-background flex justify-center items-center gap-2 "
            >
              <img src="/game.png" className="w-8 " alt="" />{" "}
              <span className="whitespace-nowrap">Game Modes</span>
            </motion.div>
          </Link>
        </div>
      </div>
    </main>
  );
}
