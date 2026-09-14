"use client";

import { User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center w-full p-3 text-sm  z-999999999 bg-background   text-foreground dark:text-foreground   dark:bg-foreground font-unbounded-sans ">
      <div id="logo" className="flex justify-start items-center gap-2">
        <img src="/logo.svg" className="w-8" alt="" />
        <div className="text-foreground dark:text-background font-semibold">
          WordRush
        </div>
      </div>
      <div id="userinfo">
        <div className="bg-white  flex items-center justify-center gap-3  w-fit px-5 py-3 cursor-pointer  rounded-full hover:bg-foreground hover:text-background duration-150 text-xs dark:bg-black dark:text-white">
          Login with <img src="/google.png" className="w-6" alt="" />
        </div>
      </div>
    </div>
  );
}
