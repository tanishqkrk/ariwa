"use client";

import { db } from "@/firebase";
import wordExists from "@/utils/checkWord";
import { generateRandomWord } from "@/utils/generateRandomWord";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import toast from "react-hot-toast";

const MultiPlayerDataContext = createContext<{
  wordLength: number;
  letterSizeForMobile: string[];
  word: string;
  setWord: React.Dispatch<React.SetStateAction<string>>;
  setHint: React.Dispatch<React.SetStateAction<string>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setChances: React.Dispatch<React.SetStateAction<number>>;
  setLife: React.Dispatch<React.SetStateAction<number>>;
  setAttempts: React.Dispatch<
    React.SetStateAction<{ letter: string; status: string }[][]>
  >;
  setLayout: React.Dispatch<
    React.SetStateAction<{ letter: string; status: string }[][]>
  >;
  hint: string;
  chances: number;
  life: number;
  attempts: { letter: string; status: string }[][];
  layout: any[][];
  currentStatus: string[];
  currentIndex: number;
  win: boolean;
  setWin: React.Dispatch<React.SetStateAction<boolean>>;
  lose: boolean;
  setLose: React.Dispatch<React.SetStateAction<boolean>>;
  setWordLength: React.Dispatch<React.SetStateAction<number>>;
  resetWord: (length?: number, chances?: number) => void;
  gameover: boolean;
  setGameover: React.Dispatch<React.SetStateAction<boolean>>;
  soundEffect: number;
  setSoundEffect: React.Dispatch<React.SetStateAction<number>>;
  showAuthModal: boolean;
  setShowAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
  gameResponse: boolean;
  isLoading: boolean;
} | null>(null);

interface RoomSettings {
  chances: number;
  wordLength: number;
  rounds: number;
}

interface RoomMember {
  name: string;
  avatar: string;
  id: number;
  admin: boolean;
}

interface RoomData {
  roomSettings: RoomSettings;
  roomMembers: RoomMember[];
  roomID: string;
}

function MultiPlayerDataProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  /**
   The word length has to be between 3 and 9
   */

  const { roomID } = useParams();

  const [gameResponse, setGameResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initialWordlength =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("length") || "") || 5
      : 0;
  const initialChances =
    typeof window !== "undefined"
      ? parseInt(localStorage.getItem("chances") || "") || 6
      : 0;
  const initialSoundSetting =
    typeof window !== "undefined"
      ? localStorage.getItem("sounds") === "0"
        ? 0
        : 1
      : 1;

  const [soundEffect, setSoundEffect] = useState(initialSoundSetting);

  const [wordLength, setWordLength] = useState(initialWordlength);

  const letterSizeForMobile = [
    "",
    "",
    "",
    "max-md:h-18",
    "max-md:h-16",
    "max-md:h-16",
    "max-md:h-14",
    "max-md:h-12",
    "max-md:h-10",
    "max-md:h-9",
  ];

  const hintSound =
    typeof Audio !== "undefined"
      ? useMemo(() => new Audio("/hint.mp3"), [])
      : undefined;
  const [word, setWord] = useState("");
  const [hint, setHint] = useState("");
  // console.log(word);

  const [chances, setChances] = useState(initialChances);
  const [life, setLife] = useState(0);
  const [win, setWin] = useState(false);

  const [lose, setLose] = useState(false);

  const [gameover, setGameover] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    let latestAttempt =
      attempts
        .filter((x) => x[0].status)
        .reverse()[0]
        ?.filter((x) => x.status === "CORRECT").length === wordLength;

    if (life === chances && !latestAttempt) {
      setTimeout(() => {
        setLose(true);
        setGameover(true);
      }, 400);
    } else if (latestAttempt) {
      setTimeout(() => {
        setWin(true);
        setGameover(true);
        if (soundEffect) hintSound?.play();
      }, 400);
    }
  }, [life]);

  console.log(soundEffect);

  async function resetWord(newWordLength?: number, newChances?: number) {
    const lengthOfWordToGenerate = newWordLength || wordLength;
    const newChancesLength = newChances || chances;

    // console.log(lengthOfWordToGenerate, newChancesLength);

    setWordLength(lengthOfWordToGenerate);
    setChances(newChancesLength);

    const luckyLad = await generateRandomWord(lengthOfWordToGenerate);
    setWord(luckyLad.word.toUpperCase());
    setHint(luckyLad.type);
    setAttempts(
      new Array(newChancesLength)
        .fill("")
        .map((x) => [
          ...new Array(lengthOfWordToGenerate).fill({ letter: "", status: "" }),
        ]),
    );

    setLife(0);
    setCurrentIndex(0);
    setLose(false);
    setWin(false);
    setGameover(false);
  }

  const [layout, setLayout] = useState(
    new Array(chances)
      .fill("")
      .map((x) => [...new Array(wordLength).fill({ letter: "", status: "" })]),
  );

  // const layout = new Array(chances)
  //   .fill("")
  //   .map((x) => [...new Array(wordLength).fill({ letter: "", status: "" })]);

  let [attempts, setAttempts] =
    useState<{ letter: string; status: string }[][]>(layout);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentStatus = useMemo(() => {
    const huh = new Array(wordLength).fill("").map((_, i) => {
      return attempts
        .filter((y, i) => i < life)
        .map((huh) => {
          if (huh[i].status === "CORRECT") {
            return huh[i].letter;
          } else {
            return "_";
          }
        });
    });

    let finalArray: string[] = new Array(wordLength).fill("");

    finalArray = huh.map((x) => {
      if (x.filter((y) => y !== "_").length > 0) {
        return x.filter((y) => y !== "_")[0];
      } else {
        return "";
      }
    });
    return finalArray;
  }, [attempts]);

  async function getRoomData() {
    try {
      if (typeof roomID === "string") {
        const response = (
          await getDoc(doc(db, "gameRooms", roomID))
        ).data() as RoomData;
        console.log("===============");
        if (!response) {
          setGameResponse(false);
        } else {
          console.log(response);
          setWordLength(response.roomSettings.wordLength);
          setChances(response.roomSettings.chances);
          setGameResponse(true);
        }
        console.log("===============");
        setIsLoading(false);
        return null;
      } else {
        setIsLoading(false);
        throw new Error("Room ID not found");
      }
    } catch (err) {
      setIsLoading(false);

      console.log(err);
    }
  }

  useEffect(() => {
    (async function () {
      await getRoomData();
    })();
  }, []);

  return (
    <MultiPlayerDataContext.Provider
      value={{
        gameover,
        setGameover,
        setChances,
        setWordLength,
        setLayout,
        win,
        setWin,
        lose,
        setLose,
        setAttempts,
        setLife,
        setCurrentIndex,
        setWord,
        setHint,
        currentIndex,
        wordLength,
        letterSizeForMobile,
        word,
        hint,
        chances,
        life,
        attempts,
        layout,
        currentStatus,
        resetWord,
        soundEffect,
        setSoundEffect,
        showAuthModal,
        setShowAuthModal,
        gameResponse,
        isLoading,
      }}
    >
      {children}
    </MultiPlayerDataContext.Provider>
  );
}

export default function useMultiPlayerData() {
  return useContext(MultiPlayerDataContext);
}
export { MultiPlayerDataProvider };
