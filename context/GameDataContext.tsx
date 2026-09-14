"use client";

import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

type localStorageKeyValues =
  | "selected_theme"
  | "volume"
  | "confetti"
  | "keyboard_animations";

type GameSettingType = Record<localStorageKeyValues, string>;

const GameDataContext = createContext<{
  getLocalGameStateData(key: localStorageKeyValues): string | false;
  setLocalGameStateData(key: localStorageKeyValues, value: string): boolean;
  gameSettings: GameSettingType;
} | null>(null);

const default_values = {
  selected_theme: "light",
  volume: "100",
  confetti: "true",
  keyboard_animations: "true",
};

function GameDataProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [gameSettings, setGameSettings] = useState<GameSettingType>({
    selected_theme: "light",
    volume: "100",
    confetti: "true",
    keyboard_animations: "true",
  });

  function getLocalGameStateData(key: localStorageKeyValues) {
    let valueToReturn = localStorage.getItem(key);
    if (valueToReturn) {
      return valueToReturn;
    } else {
      return false;
    }
  }
  function setLocalGameStateData(key: localStorageKeyValues, value: string) {
    setGameSettings((org) => ({
      ...org,
      [key]: value,
    }));

    localStorage.setItem(key, value);
    return true;
  }

  function setupInitalLocalGameState() {
    (
      Array.from(Object.keys(default_values)) as localStorageKeyValues[]
    ).forEach((x) => {
      if (!getLocalGameStateData(x)) {
        setLocalGameStateData(x, default_values[x]);
      } else {
        setLocalGameStateData(x, getLocalGameStateData(x) as string);
      }
    });
  }

  function setupTheme() {
    const theme = getLocalGameStateData("selected_theme");
    if (theme === "dark") {
      document.querySelector("html")?.classList.add("dark");
    } else if (theme === "dark") {
      document.querySelector("html")?.classList.remove("dark");
    }

    return true;
  }

  useEffect(() => {
    setupTheme();
    setupInitalLocalGameState();
  }, []);

  return (
    <GameDataContext.Provider
      value={{ getLocalGameStateData, setLocalGameStateData, gameSettings }}
    >
      {children}
    </GameDataContext.Provider>
  );
}

export default function useGameData() {
  return useContext(GameDataContext);
}
export { GameDataProvider };
