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
  type LocalGameSettingsType = {
    selectedTheme: "light" | "dark" | "system";
  };

  const [localGameData, setLocalGameData] = useState<LocalGameSettingsType>({
    selectedTheme: "dark",
  });

  localStorage.setItem("selectedTheme", "light");

  function getGameSettingsDataFromLocalStorageOnPageLoad() {
    setLocalGameData(() => ({ ...localStorage }));
  }

  useEffect(() => {
    getGameSettingsDataFromLocalStorageOnPageLoad();
    console.log(localStorage);
  }, []);
  // console.log(localGameData);

  return (
    <GameDataContext.Provider value={{ localGameData }}>
      {children}
    </GameDataContext.Provider>
  );
}

export default function useGameData() {
  return useContext(GameDataContext);
}
export { GameDataProvider };
