"use client";

import { User } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center w-full p-3 text-sm fixed">
      <div id="logo" className="flex justify-start items-center gap-2">
        <img src="/logo.svg" className="w-10" alt="" />
        <div className="text-base font-bold">WordRush</div>
      </div>
      <div id="userinfo">
        <div className="bg-white border border-foreground flex items-center justify-center gap-3  w-fit px-5 py-2 cursor-pointer  rounded-full hover:bg-foreground hover:text-background duration-150">
          Login with <img src="/google.png" className="w-8" alt="" />
        </div>
      </div>
    </div>
  );
}
