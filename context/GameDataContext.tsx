"use client";

import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

const GameDataContext = createContext<{} | null>(null);

function GameDataProvider({ children }: Readonly<{ children: ReactNode }>) {
  function getLocalGameStateData(key: string) {
    return "";
  }

  // localStorage.setItem("selectedTheme", "light");

  function getGameSettingsDataFromLocalStorageOnPageLoad() {}

  useEffect(() => {
    getGameSettingsDataFromLocalStorageOnPageLoad();
    console.log(localStorage);
  }, []);
  // console.log(localGameData);

  return (
    <GameDataContext.Provider value={{ getLocalGameStateData }}>
      {children}
    </GameDataContext.Provider>
  );
}

export default function useGameData() {
  return useContext(GameDataContext);
}
export { GameDataProvider };
