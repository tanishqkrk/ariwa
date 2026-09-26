"use client";

import { motion } from "motion/react";
import { Switch } from "@/components/ui/Switch";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import {
  Keyboard,
  Laptop,
  Moon,
  Palette,
  PartyPopper,
  Settings,
  Sun,
  Vibrate,
  Volume,
  Volume1,
  Volume2,
} from "lucide-react";
import useGameData from "@/context/GameDataContext";
import { ReactElement } from "react";
import { Label } from "./ui/Label";
import { Slider } from "./ui/Slider";

export default function GlobalSettingsComponent({
  trigger,
}: {
  trigger?: ReactElement;
}) {
  const normalButtonVibrate = 30;
  const { setLocalGameStateData, gameSettings } = useGameData()!;

  return (
    <Drawer>
      <DrawerTrigger
        render={
          trigger ? (
            trigger
          ) : (
            <motion.button
              whileTap={{
                scale: 0.91,
              }}
              className="bg-linear-to-r from-zinc-900 to-black dark:from-zinc-100 dark:to-white text-background dark:text-foreground rounded-full p-2 flex text-xs items-center gap-2 shadow-lg shadow-black/10 px-3 font-unbounded"
            >
              <Settings></Settings>
              <div>Settings</div>
            </motion.button>
          )
        }
      ></DrawerTrigger>
      <DrawerContent
        className={
          "bg-white   text-foreground dark:text-background   dark:bg-black border-none rounded-xl font-unbounded z-999999999999 "
        }
      >
        <DrawerHeader>
          <DrawerTitle className={"text-start dark:text-white"}>
            Settings
          </DrawerTitle>
          <DrawerDescription
            className={"text-start text-black/70 dark:text-white font-google"}
          >
            Change the overall website's settings.
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <div>Appearance</div>
          <div className="grid grid-cols-3 gap-3">
            {["light", "dark", "custom"].map((x) => {
              return (
                <motion.button
                  disabled={x === "custom"}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() => {
                    if (gameSettings.haptics === "true" ? true : false)
                      navigator.vibrate(normalButtonVibrate);

                    if (x !== "custom")
                      setLocalGameStateData("selected_theme", x);
                    if (x === "dark") {
                      document.querySelector("html")?.classList.add("dark");
                    } else if (x === "light") {
                      document.querySelector("html")?.classList.remove("dark");
                    }
                  }}
                  key={x}
                  className={`w-full   p-4 rounded-lg flex flex-col justify-center items-center gap-2 border  ${gameSettings.selected_theme !== x ? "border-foreground/20 dark:border-background/20  bg-white   text-foreground dark:text-background   dark:bg-foreground" : "bg-green/15 border-green text-green"} disabled:opacity-45`}
                >
                  {x === "light" ? (
                    <Sun></Sun>
                  ) : x === "dark" ? (
                    <Moon></Moon>
                  ) : (
                    <Palette></Palette>
                  )}

                  <div className="uppercase text-xs ">{x}</div>
                </motion.button>
              );
            })}
          </div>
        </div>
        <div className="p-4 space-y-3 ">
          <div>Game preferences</div>
          <div className="py-3 border-foreground/20 dark:border-background/20 border rounded-lg divide-y-2 divide-foreground/10 space-y-2">
            <Label
              htmlFor="keyboard_animations"
              className="min-w-full flex items-center justify-start gap-3 p-3"
            >
              <div className="w-fit ">
                <Volume2></Volume2>
              </div>
              <div className="w-full">
                <div className="text-xs">Play Sounds</div>
                <div
                  style={{
                    fontFamily: "Google Sans; sans-serif",
                  }}
                  className="font-google text-xs text-foreground/60 dark:text-background/60"
                >
                  Typing, guessed, wrong sounds etc
                </div>
              </div>
              <div className="">
                <Switch
                  onCheckedChange={(e) => {
                    if (gameSettings.haptics === "true" ? true : false)
                      navigator.vibrate(normalButtonVibrate);
                    setLocalGameStateData("sound_effects", e.toString());
                    console.log(e);
                  }}
                  checked={gameSettings.sound_effects === "true" ? true : false}
                  id="keyboard_animations"
                  className={"scale-125"}
                />
              </div>
            </Label>
            <Label
              htmlFor="haptics"
              className="min-w-full flex items-center justify-start gap-3 p-3"
            >
              <div className="w-fit ">
                <Vibrate></Vibrate>
              </div>
              <div className="w-full">
                <div className="text-xs">Haptics</div>
                <div className="font-google text-xs text-foreground/60 dark:text-background/60">
                  Haptic feedback when interacting with{" "}
                </div>
              </div>
              <div className="">
                <Switch
                  onCheckedChange={(e) => {
                    if (gameSettings.haptics === "true" ? true : false)
                      navigator.vibrate(normalButtonVibrate);

                    setLocalGameStateData("haptics", e.toString());
                    console.log(e);
                  }}
                  checked={gameSettings.haptics === "true" ? true : false}
                  id="confetti"
                  className={"scale-125"}
                />
              </div>
            </Label>
          </div>
        </div>
        <DrawerFooter>
          {/* <DrawerClose
            render={<button className="bg-foreground/10 p-3 rounded-lg" />}
          >
            Cancel
          </DrawerClose> */}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
