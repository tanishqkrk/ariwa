"use client";

import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

const GameDataContext = createContext<{
  getLocalGameStateData: any;
  setLocalGameStateData: any;
} | null>(null);

function GameDataProvider({ children }: Readonly<{ children: ReactNode }>) {
  const default_values = {
    selected_theme: "light",
    volume: "100",
    confetti: "true",
    keyboard_animations: "true",
  };

  type LocalStorageKeyValues =
    | "selected_theme"
    | "volume"
    | "confetti"
    | "keyboard_animations";

  function getLocalGameStateData(key: LocalStorageKeyValues) {
    let valueToReturn = localStorage.getItem("key");
    if (valueToReturn) {
      return "";
    } else {
      return false;
    }
  }
  function setLocalGameStateData(key: LocalStorageKeyValues, value: string) {
    return true;
  }

  function setupInitalLocalGameState() {
    (
      Array.from(Object.keys(default_values)) as LocalStorageKeyValues[]
    ).forEach((x) => {
      getLocalGameStateData(x);
    });
  }

  useEffect(() => {
    setupInitalLocalGameState();
    // getGameSettingsDataFromLocalStorageOnPageLoad();
  }, []);

  return (
    <GameDataContext.Provider
      value={{ getLocalGameStateData, setLocalGameStateData }}
    >
      {children}
    </GameDataContext.Provider>
  );
}

export default function useGameData() {
  return useContext(GameDataContext);
}
export { GameDataProvider };
