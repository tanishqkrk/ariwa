"use client";

import GameGridComponent from "@/components/GameGrid";
import { Keyboard } from "@/components/Keyboard";
import { playSound } from "@/lib/sounds";
import wordExists from "@/utils/checkWord";
import { generateRandomWord } from "@/utils/generateRandomWord";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  GamepadIcon,
  RotateCcw,
  Zap,
} from "lucide-react";
import confetti from "canvas-confetti";
import useGameData, { GameDataProvider } from "@/context/GameDataContext";
import GlobalSettingsComponent from "@/components/GlobalSettingsComponent";
import Script from "next/script";
import Link from "next/link";
import { turnConfettiOff, turnConfettiOn } from "@/lib/toggleConfetti";
import Image from "next/image";
import useStopwatch from "@/lib/useStopwatch";

export default function CasualGameMode() {
  const { gameSettings } = useGameData()!;
  const {
    formatSecondsToString,
    convertEpochDifferenceIntoSeconds,
    endTimeEpoch,
    setEndTimeEpoch,
    setStartTimeEpoch,
    startTimeEpoch,
  } = useStopwatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordLength, setWordLength] = useState(5);
  const [chances, setChances] = useState(6);
  const [life, setLife] = useState(0);

  // Layout is the mathematical matrix to determine the UI
  const [layout, setLayout] = useState(
    new Array(chances)
      .fill("")
      .map((x) => [...new Array(wordLength).fill({ letter: "", status: "" })]),
  );

  const [word, setWord] = useState("");

  // The actual matrix that gets mapped
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
    if (gameSettings.sound_effects === "true" ? true : false) playSound("add");
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

    if (gameSettings.sound_effects === "true" ? true : false)
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
      if (gameSettings.sound_effects === "true" ? true : false)
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
                      // If the letter does not exist at all
                      if (!wordArray.includes(attemptArray[idx])) {
                        return {
                          ...y,
                          status: "INCORRECT",
                        };
                      }
                      // TODO: Logic for repeated letters
                      // else if (
                      //   wordArray.filter((x) => x === attemptArray[idx])
                      //     .length < dict[attemptArray[idx]]
                      // ) {
                      //   return {
                      //     ...y,
                      //     status: "INCORRECT",
                      //   };
                      // }
                      //
                      else if (wordArray[idx] === attemptArray[idx]) {
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
      setStartTimeEpoch(Date.now());
      // setHint(luckyLad.type);
    })();
  }, []);

  // const gameEndConfetti = new Freezeframe("#gameEndConfetti", {
  //   warnings: false,
  //   trigger: false,
  // });
  useEffect(() => {
    let isLatestAttemptCorrect =
      attempts
        .filter((x) => x[0].status)
        .reverse()[0]
        ?.filter((x) => x.status === "CORRECT").length === wordLength;

    console.log(isLatestAttemptCorrect);

    if (life === chances && !isLatestAttemptCorrect) {
      setTimeout(() => {
        setGameover(true);
        setLose(true);
      }, 400);
      setEndTimeEpoch(Date.now());
    } else if (isLatestAttemptCorrect) {
      setEndTimeEpoch(Date.now());
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
        if (gameSettings.sound_effects === "true" ? true : false)
          playSound("hint");
        setWin(true);
      }, 400);
      setTimeout(() => {
        turnConfettiOn();
      }, 450);
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

  async function resetWord() {
    turnConfettiOff();
    const luckyLad = await generateRandomWord(wordLength);
    setWord(luckyLad.word.toUpperCase());
    setWin(false);
    setGameover(false);
    setAttempts(layout);
    setLife(0);
    setCurrentIndex(0);
    setStartTimeEpoch(Date.now());
  }

  return (
    <div
      className="flex justify-center items-center flex-col  bg-background dark:bg-foreground gap-6 --min-h-[calc(100vh)] overflow-x-hidden overflow-y-hidden py-6 pb- px-3 relative "
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
      <AnimatePresence>
        {gameover && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="z-999999"
          >
            <motion.div className="bg-foreground/50 backdrop-blur-xs  fixed top-0 left-0 h-screen w-screen duration-200 z-9999"></motion.div>
            {win ? (
              <div
                className="bg-white dark:bg-black fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[95%] h- z-999999 rounded-3xl flex flex-col justify-center items-center pb-12 space-y-8
              "
              >
                <Script
                  id="ungabunga"
                  src="https://run.confettipage.com/here.js"
                  data-confetticode="U2FsdGVkX18MKScTzJn6AdfsIpok9d+3SbPaSLoB8Q1V3O8Z8FwQt7RpZWApcP+xHFnRpoolQ+7v+SZwce1gtILaCPyHyIVbtzhU8GCtjS8RqRVd6H14N3lljdV2PSGLDroWuOFbUqlAApi7vNFWyicxQ0Dkl2DiKUe0wGKKa+H0jzrOjpzvU/a+9bfJCGX2ltl8uv2d8Wmh8jQuL0086Qqc268Fp/tutJ5UZJge5hztsvdeVkXS2NQ/sI5tYCq8BjeLk0DS3O/VAjWHw7UGDvdp6POxMmudwfIG+8gzgns1LId8ljYc9OvuWptfGV5v5gTxWi15poi16G/Aff2JS0icNQlkG1zs2vRKA+RB+RZynTsQJjHYW2/DUBE5qFaSQE88q4a/BHpifEFts2X0sRO+d7jQ4+x7h8Y+Q4D0pH9yCfr8Hcn4X4iZVVZdNpoZCF7PdZHzfMHSxMGu2xjg3uZ4vlfVqRDWzB+SQV408wZ4dZ+ysFbzNBlDh+HEQ13mpAWjrb8hE8E77gTXAwjEJNQG+fZRf3cszCoPRAYMsRQRWNFXF6DpbmlkQMxmoyPT63l+SZI931ZBF3JYhcmxyEXS/0c38RDuEwAgPZyE6dwcx1CI/4rkTtqJorcnKZQVidSET1pJK+6PXln/xMxJOxzDUZa7nbC8WaEus9ovzR+OII+e5YIQlvwyDWXTRFsiRYZQIEIEEcnmShqdLVGdHr81AQ3cTRBKQbJvtp/snZdadbwWohKPXX5u0SfgLdf9"
                ></Script>
                {/* <img
                  src="/confetti2.gif"
                  className="absolute top-0 left-0 h-full object-cover brightness-125  "
                  alt=""
                /> */}
                <div className="space-y-1 flex flex-col justify-center items-center z-999">
                  <Image
                    width={560}
                    height={560}
                    loading="eager"
                    fetchPriority="high"
                    src="/newtrophy.png"
                    className="w-56"
                    alt=""
                  />

                  <div className="text-3xl font-semibold ">
                    You <span className="text-green">Win</span>
                  </div>
                  <div className="font-google-sans text-foreground/80 dark:text-background/80">
                    Great job! You Guessed the word!
                  </div>
                  <div className="space-x-px py-2 w-full flex justify-center items-center">
                    {word.split("").map((x) => (
                      <span
                        key={x}
                        className="bg-linear-to-r to-emerald-700 from-green-700 text-white h-full  w-full aspect-square rounded-lg flex justify-center items-center text-xl font-semibold"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 flex w-full justify-between items-center px-3 divide-x-2 divide-foreground/30">
                  {[
                    {
                      type: "Tries used",
                      value: life,
                    },
                    {
                      type: "Time taken",
                      value: formatSecondsToString(
                        convertEpochDifferenceIntoSeconds(
                          endTimeEpoch,
                          startTimeEpoch,
                        ),
                      ),
                    },
                  ].map((x, i) => {
                    return (
                      <div
                        key={x.type}
                        className="flex flex-col justify-center items-center   w-full space-y-2"
                      >
                        <div className="w-full flex justify-center items-center mb-">
                          {i === 0 ? (
                            <Zap
                              className="fill-green stroke-green "
                              strokeWidth="0"
                              size={30}
                            ></Zap>
                          ) : i === 1 ? (
                            <Clock
                              className="stroke-green"
                              strokeWidth="2"
                              size={30}
                            ></Clock>
                          ) : i === 2 ? (
                            <Zap
                              className="fill-green stroke-green "
                              strokeWidth="0"
                              size={30}
                            ></Zap>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className=" w-full text-center  flex justify-center items-center font-google-sans mb-">
                          {x.value}
                        </div>
                        <div className="w-full  text-center text-sm text-foreground/80 dark:text-background/80 font-google">
                          {x.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-3 w-full flex flex-col justify-center items-center gap-3 font-google">
                  <motion.button
                    onClick={async () => {
                      await resetWord();
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="bg-linear-to-r to-emerald-500 from-green-600 w-full p-3 rounded-full text-background flex justify-center items-center gap-0  text-center py-5"
                  >
                    Next word
                    <ChevronRight size={20}></ChevronRight>
                  </motion.button>
                  <Link href={"/all-modes"} className="w-full">
                    <motion.button
                      onClick={() => {
                        turnConfettiOff();
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="bg-foreground/5 dark:bg-background/5 w-full p-3 rounded-full text-foreground dark:text-background flex justify-center items-center gap-0  text-center py-5"
                    >
                      <ChevronLeft size={20}></ChevronLeft>
                      Back to modes
                    </motion.button>
                  </Link>
                </div>
              </div>
            ) : (
              <div
                className="bg-white dark:bg-black fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[95%] h- z-999999 rounded-3xl flex flex-col justify-center items-center pb-12 space-y-8
              "
              >
                <div className="space-y-1 flex flex-col justify-center items-center z-999">
                  <Image
                    width={560}
                    height={560}
                    loading="eager"
                    fetchPriority="high"
                    src="/heartbreak.png"
                    className="w-56"
                    alt=""
                  />

                  <div className="text-xl font-semibold text-center ">
                    Better Luck Next Time
                  </div>
                  <div className="font-google-sans text-foreground/80 dark:text-background/80">
                    The word was
                  </div>
                  <div className="space-x-px py-2 w-full flex justify-center items-center">
                    {word.split("").map((x) => (
                      <span
                        key={x}
                        className="bg-linear-to-b from-orange-500 to-red-500 text-white h-full  w-full aspect-square rounded-lg flex justify-center items-center text-xl font-semibold"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 flex w-full justify-between items-center px-3 divide-x-2 divide-foreground/30">
                  {[
                    {
                      type: "Tries used",
                      value: life,
                    },
                    {
                      type: "Time taken",
                      value: formatSecondsToString(
                        convertEpochDifferenceIntoSeconds(
                          endTimeEpoch,
                          startTimeEpoch,
                        ),
                      ),
                    },
                  ].map((x, i) => {
                    return (
                      <div
                        key={x.type}
                        className="flex flex-col justify-center items-center   w-full space-y-2"
                      >
                        <div className="w-full flex justify-center items-center mb-">
                          {i === 0 ? (
                            <Zap
                              className="fill-red stroke-red "
                              strokeWidth="0"
                              size={30}
                            ></Zap>
                          ) : i === 1 ? (
                            <Clock
                              className="stroke-red"
                              strokeWidth="2"
                              size={30}
                            ></Clock>
                          ) : i === 2 ? (
                            <Zap
                              className="fill-red stroke-red "
                              strokeWidth="0"
                              size={30}
                            ></Zap>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className=" w-full text-center  flex justify-center items-center font-google-sans mb-">
                          {x.value} {x.type === "Tries used" && "/ " + life}
                        </div>
                        <div className="w-full  text-center text-sm text-foreground/80 dark:text-background/80 font-google">
                          {x.type}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="px-3 w-full flex flex-col justify-center items-center gap-3 font-google">
                  <motion.button
                    onClick={async () => {
                      await resetWord();
                    }}
                    whileTap={{
                      scale: 0.95,
                    }}
                    className="bg-linear-to-b from-orange-600 to-red-600 w-full p-3 rounded-full text-background flex justify-center items-center gap-2  text-center py-5"
                  >
                    Try again
                    <RotateCcw size={20}></RotateCcw>
                  </motion.button>
                  <Link href={"/all-modes"} className="w-full">
                    <motion.button
                      onClick={() => {
                        turnConfettiOff();
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                      className="bg-foreground/5 dark:bg-background/5 w-full p-3 rounded-full text-foreground dark:text-background flex justify-center items-center gap-0  text-center py-5"
                    >
                      <ChevronLeft size={20}></ChevronLeft>
                      Back to modes
                    </motion.button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
