"use client";

import GameGridComponent from "@/components/GameGrid";
import { Keyboard } from "@/components/Keyboard";
import { playSound } from "@/lib/sounds";
import wordExists from "@/utils/checkWord";
import { generateRandomWord } from "@/utils/generateRandomWord";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  Crown,
  GamepadIcon,
  Laptop,
  Menu,
  Moon,
  PartyPopper,
  Settings,
  Sun,
  Trophy,
} from "lucide-react";
import confetti from "canvas-confetti";
import useGameData, { GameDataProvider } from "@/context/GameDataContext";
import GlobalSettingsComponent from "@/components/GlobalSettingsComponent";

export default function CasualGameMode() {
  const { gameSettings } = useGameData()!;

  let selectedTheme = "light";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordLength, setWordLength] = useState(5);
  const [chances, setChances] = useState(6);
  const [life, setLife] = useState(0);
  const [layout, setLayout] = useState(
    new Array(chances)
      .fill("")
      .map((x) => [...new Array(wordLength).fill({ letter: "", status: "" })]),
  );

  const [word, setWord] = useState("");

  let [attempts, setAttempts] =
    useState<{ letter: string; status: string }[][]>(layout);

  const [gameover, setGameover] = useState(false);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
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

  function addLetter(letter: string) {
    if (gameover) return;
    // if (soundEffect)

    playSound("add");
    if (currentIndex < wordLength) {
      let localIndex = currentIndex;

      setCurrentIndex((org) => org + 1);
      localIndex = localIndex + 1;
      setAttempts((org) =>
        org.map((x, i) => {
          if (i === life) {
            return x.map((y, i) => {
              if (i === currentIndex) {
                return { letter, status: "" };
              } else {
                return y;
              }
            });
          } else {
            return x;
          }
        }),
      );
    }
  }

  function removeLetter() {
    if (gameover) return;

    // if (soundEffect)

    playSound("remove");
    if (currentIndex > 0) {
      let localIndex = currentIndex;
      setCurrentIndex((org) => org - 1);
      localIndex = localIndex - 1;
      setAttempts((org) =>
        org.map((x, i) => {
          if (i === life) {
            return x.map((y, i) => {
              if (i === localIndex) {
                return { letter: "", status: "" };
              } else {
                return y;
              }
            });
          } else {
            return x;
          }
        }),
      );
    }
  }
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  function submitAttempt() {
    function shakeKeyboard() {
      // if (soundEffect)
      playSound("error");
      document
        .querySelector("#virtual-keyboard")
        ?.classList.add("error-shake-set");
      setTimeout(() => {
        document
          .querySelector("#virtual-keyboard")
          ?.classList.remove("error-shake-set");
      }, 200);
    }

    if (life < chances) {
      if (attempts[life].filter((x) => x.letter === "").length > 0) {
        shakeKeyboard();
      } else {
        if (
          wordExists(attempts[life].map((x) => x.letter).join(""))
          // true
        ) {
          const wordArray = word.split("");
          const attemptArray = attempts[life].map((x) => x.letter);

          const dict: any = {};
          for (let idx = 0; idx < wordLength; idx++) {
            setAttempts((org) => {
              const newAttempt = org.map((x, i) => {
                if (i === life) {
                  return x.map((y, i) => {
                    if (i === idx) {
                      if (!wordArray.includes(attemptArray[idx])) {
                        return {
                          ...y,
                          status: "INCORRECT",
                        };
                      } else if (
                        wordArray.filter((x) => x === attemptArray[idx])
                          .length < dict[attemptArray[idx]]
                      ) {
                        return {
                          ...y,
                          status: "INCORRECT",
                        };
                      } else if (wordArray[idx] === attemptArray[idx]) {
                        return {
                          ...y,
                          status: "CORRECT",
                        };
                      } else if (wordArray.includes(attemptArray[idx])) {
                        return {
                          ...y,
                          status: "EXISTS",
                        };
                      } else {
                        return {
                          ...y,
                          status: "INCORRECT",
                        };
                      }
                    } else {
                      return y;
                    }
                  });
                } else {
                  return x;
                }
              });

              return newAttempt;
            });
          }

          setLife((org) => org + 1);
          setCurrentIndex(0);
        } else {
          shakeKeyboard();
        }
      }
    }
  }

  const keyboardRef = useRef<HTMLInputElement>(null);
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  );

  useEffect(() => {
    (async function () {
      const luckyLad = await generateRandomWord(wordLength);
      setWord(luckyLad.word.toUpperCase());
      // setHint(luckyLad.type);
    })();
  }, []);

  useEffect(() => {
    let latestAttempt =
      attempts
        .filter((x) => x[0].status)
        .reverse()[0]
        ?.filter((x) => x.status === "CORRECT").length === wordLength;

    if (life === chances && !latestAttempt) {
      setTimeout(() => {
        setGameover(true);
        setLose(true);
      }, 400);
    } else if (latestAttempt) {
      setTimeout(() => {
        if (gameSettings.confetti === "true" ? true : false) {
          confetti({
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }
        setGameover(true);
        playSound("hint");
        setWin(true);
      }, 400);
    }
  }, [life]);

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

  return (
    <div
      className="flex justify-center items-center flex-col  bg-background dark:bg-foreground gap-6 --min-h-[calc(100vh)] overflow-x-hidden overflow-y-hidden py-6 pb-18 px-3 relative "
      onClick={() => {
        if (keyboardRef.current) keyboardRef.current.focus();
      }}
    >
      <div className="options flex justify-end items-center w-full gap-2">
        <motion.button
          whileTap={{
            scale: 0.91,
          }}
          className="bg-linear-to-r from-blue-600 to-sky-700 text-background rounded-full p-2 flex text-xs items-center gap-2 shadow-lg shadow-black/10 px-3"
        >
          <GamepadIcon></GamepadIcon>

          <div>Customize Game</div>
        </motion.button>
        <GlobalSettingsComponent></GlobalSettingsComponent>
      </div>

      <AnimatePresence>
        {gameover && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 0.6,
            }}
            exit={{
              opacity: 0,
            }}
            className="bg-background  fixed top-0 left-0 h-screen w-screen duration-200 z-9999"
          ></motion.div>
        )}
      </AnimatePresence>

      <GameGridComponent
        attempts={attempts}
        currentIndex={currentIndex}
        letterSizeForMobile={letterSizeForMobile}
        life={life}
        wordLength={wordLength}
      ></GameGridComponent>
      {!gameover ? (
        <div className="flex text-correct  min-h-10 gap-2 text-xl">
          {word.split("").map((x, i) => {
            if (x) {
              return <p key={i}>{x}</p>;
            } else {
              return <p key={i}>_</p>;
            }
          })}
        </div>
      ) : (
        <div className="flex text-correct  min-h-10 gap-2 text-xl">
          {currentStatus.map((x, i) => {
            if (x) {
              return <p key={i}>{x}</p>;
            } else {
              return <p key={i}>_</p>;
            }
          })}
        </div>
      )}
      <div className="relative h-full">
        <Keyboard
          addLetter={addLetter}
          removeLetter={removeLetter}
          lastPressedKey={lastPressedKey}
          letterStatus={attempts.flat().filter((x) => x.letter && x.status)}
          submitAttempt={submitAttempt}
        ></Keyboard>
      </div>
      <input
        readOnly
        ref={keyboardRef}
        autoFocus
        type="text"
        className="opacity-0 pointer-events-none fixed"
        onKeyDown={(e) => {
          const code = e.code.replaceAll("Key", "");

          if (!gameover) {
            if (e.code === "Enter") {
              submitAttempt();
            }
            if (!e.ctrlKey) {
              setLastPressedKey(code);
              if (letters.includes(code)) {
                addLetter(code);
              }
              if (e.code === "Backspace") {
                removeLetter();
              }
            }
          }

          setTimeout(() => {
            setLastPressedKey(null);
          }, 100);
        }}
        name=""
        id=""
      />
    </div>
  );
}
