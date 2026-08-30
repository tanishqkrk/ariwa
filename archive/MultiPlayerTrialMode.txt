import { memo, use, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import toast from "react-hot-toast";
import wordExists from "@/utils/checkWord";
import { generateRandomWord } from "@/utils/generateRandomWord";
import {
  ALargeSmall,
  Annoyed,
  Book,
  ChevronLeft,
  Frown,
  Gamepad,
  Gamepad2,
  Heart,
  LetterText,
  Lightbulb,
  Lock,
  RefreshCcw,
  RotateCw,
  Settings,
  Settings2,
  SwatchBook,
  Trophy,
  User,
  Volume,
  Volume2,
  X,
} from "lucide-react";
import { Keyboard } from "@/components/Keyboard";
import useSinglePlayerData from "@/context/GameDataContext";
import ModalContainer from "../components/Modal";
import GameGridComponent from "../components/GameGrid";
import useMultiPlayerData from "@/archive/MultiPlayerDataContext";
import { playSound } from "@/lib/sounds";

export default memo(function MultiPlayerTrialModeComponent() {
  const [showHintsMenu, setShowHintsMenu] = useState(false);

  const [typeHintTaken, setTypeHintTaken] = useState(false);
  const [definitionHintTaken, setDefinitionHintTaken] = useState(false);

  const [wordTypes, setWordTypes] = useState([]);
  const [wordDefinition, setWordDefinition] = useState("");

  async function activateHint(type: "type" | "definition") {
    // setShowHintsMenu(false);

    if (type === "type") {
      setTypeHintTaken(true);
      const fetchedWordType = await (
        await fetch("/api/getHintWordType", {
          method: "POST",
          body: JSON.stringify({
            word,
          }),
        })
      ).json();

      setWordTypes(fetchedWordType.wordTypes);
    } else if (type === "definition") {
      setDefinitionHintTaken(true);
      const fetchedWordType = await (
        await fetch("/api/getHintWordDefinition", {
          method: "POST",
          body: JSON.stringify({
            word,
          }),
        })
      ).json();

      setWordDefinition(fetchedWordType.definition);
    }

    window.scrollTo({
      top: 1000,
      behavior: "smooth",
    });
  }

  const keyboardRef = useRef<HTMLInputElement>(null);

  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  const {
    attempts,
    setChances,
    chances,
    currentStatus,
    hint,
    letterSizeForMobile,
    life,
    word,
    wordLength,
    currentIndex,
    setHint,
    setWord,
    setCurrentIndex,
    setAttempts,
    setLife,
    lose,
    setLose,
    setWin,
    win,
    layout,
    setWordLength,
    setLayout,
    resetWord,
    gameover,
    setGameover,
    setSoundEffect,
    soundEffect,
    setShowAuthModal,
    showAuthModal,
    gameResponse,
    isLoading,
  } = useMultiPlayerData()!;

  // console.log(word);

  useEffect(() => {
    (async function () {
      const luckyLad = await generateRandomWord(wordLength);
      setWord(luckyLad.word.toUpperCase());
      setHint(luckyLad.type);
    })();
  }, []);

  function callEndgame() {
    resetWord();
    setTypeHintTaken(false);
    setDefinitionHintTaken(false);
    setWordTypes([]);
    setWordDefinition("");
  }

  function addLetter(letter: string) {
    if (gameover) return;
    if (soundEffect) playSound("add");
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

    if (soundEffect) playSound("remove");
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
  const letters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i),
  );
  function submitAttempt() {
    if (life < chances) {
      if (attempts[life].filter((x) => x.letter === "").length > 0) {
        toast.error("Finished the word?", {
          icon: <Annoyed strokeWidth="1" color="#ffffff99"></Annoyed>,
          style: {
            background: "#1a1a1a",
            color: "#ffffff99",
            boxShadow: "none",
            filter: "none",
            borderRadius: "8px",
            border: "1px solid #ffffff10",
          },
          position: "top-center",
        });
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
          toast.error("Not really a word bruv.", {
            icon: <Annoyed strokeWidth="1" color="#ffffff99"></Annoyed>,
            style: {
              background: "#1a1a1a",
              color: "#ffffff99",
              boxShadow: "none",
              filter: "none",
              borderRadius: "8px",
              border: "1px solid #ffffff10",
            },
            position: "top-center",
          });
        }
      }
    }
  }

  if (isLoading)
    return (
      <main
        onClick={() => {
          if (keyboardRef.current) keyboardRef.current.focus();
        }}
        className="overflow-hidden  flex justify-center items-center flex-col  bg-background text-foreground h-screen gap-3 "
      >
        <div className="flex flex-col gap-3 justify-center items-center ">
          <div className="loader"></div>
        </div>
      </main>
    );

  if (!gameResponse && !isLoading) {
    return (
      <main
        onClick={() => {
          if (keyboardRef.current) keyboardRef.current.focus();
        }}
        className="overflow-hidden  flex justify-center items-center flex-col  bg-background text-foreground h-screen gap-3 "
      >
        <div className="flex flex-col gap-3 justify-center items-center ">
          <div className="text-xl">Game not found</div>
          <div>
            <motion.button
              whileTap={{
                scale: 0.9,
              }}
              onClick={() => {
                window.location.href = "/";
              }}
              className="p-2 px-3 bg-incorrect text-foreground rounded-lg  capitalize flex justify-center items-center gap-1"
            >
              <ChevronLeft></ChevronLeft> Go to singleplayer
            </motion.button>
          </div>
        </div>
      </main>
    );
  }

  if (gameResponse)
    return (
      <main
        onClick={() => {
          if (keyboardRef.current) keyboardRef.current.focus();
        }}
        className="overflow-hidden  flex justify-center items-center flex-col  bg-background"
      >
        {/* <div className="absolute left-0 top-0 text-white">{word}</div> */}

        <ModalContainer
          // preventClosingByClickingOnBackground
          show={showHintsMenu}
          setShow={setShowHintsMenu}
          className="max-h-[80vh] noscroll overflow-y-scroll overflow-x-hidden"
        >
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
            className="text-white bg-background p-8 px-5 max-md:px-3 rounded-xl  flex justify-center items-center z-9999999999999999 pt-8"
          >
            <div className="flex justify-center items-center flex-col gap-8 w-full min-w-110 max-md:min-w-84 max-md:w-fit">
              <button
                onClick={() => {
                  setShowHintsMenu(false);
                }}
                className="flex justify-end items-center w-full text-foreground/50 absolute top-3 right-3 cursor-pointer"
              >
                <X></X>
              </button>
              <div className="w-full space-y-8">
                <div className="">
                  <div className="text-xl font-semibold text-left w-full">
                    Need A Nudge?
                  </div>
                  <div className="text-sm  text-left w-full ">
                    Choose one of the hint types below
                  </div>
                </div>
                <div className="space-y-0">
                  <button
                    onClick={async () => {
                      await activateHint("type");
                    }}
                    disabled={typeHintTaken}
                    className="flex justify-start items-center hover:bg-foreground/10 p-3 rounded-md duration-200 cursor-pointer text-left w-full disabled:pointer-events-none -disabled:opacity-40 max-md:px-0"
                  >
                    <div className="flex items-center justify-start gap-2">
                      <SwatchBook
                        className="bg-green-600/20 text-teal-600 p-1 rounded-md"
                        size={40}
                      ></SwatchBook>

                      {typeHintTaken && wordTypes.length > 0 ? (
                        <div className="text-foreground text-sm  text-center space-x-1">
                          {wordTypes.map((x, i) => (
                            <span key={x} className="">
                              {/* a{" "} */}
                              <span className="capitalize bg-green-600/10 p-2 rounded-lg font-semibold border border-teal-500 text-teal-500">
                                {x}
                              </span>{" "}
                            </span>
                          ))}
                        </div>
                      ) : typeHintTaken && wordTypes.length === 0 ? (
                        <div className="relative">
                          <div className="loader scale-50 translate-y-1"></div>
                        </div>
                      ) : (
                        <div className="">
                          <div className="text-sm text-teal-500 ">
                            Part of Speech
                          </div>
                          <div className="text-xs text-foreground/80">
                            Check if the word's part of speech
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={async () => {
                      await activateHint("definition");
                    }}
                    disabled={definitionHintTaken}
                    className=" flex justify-start items-center hover:bg-foreground/10 p-3 rounded-md duration-200 cursor-pointer text-left w-full disabled:pointer-events-none -disabled:opacity-40 max-md:px-0"
                  >
                    <div className="flex items-center justify-start gap-2">
                      <Book
                        className="bg-cyan-400/20 text-cyan-400 p-1 rounded-md"
                        size={40}
                      ></Book>
                      {definitionHintTaken && wordDefinition.length > 0 ? (
                        <div className=" text-sm  max-w-84 max-md:max-w-84   text-cyan-400">
                          {wordDefinition}
                        </div>
                      ) : definitionHintTaken && wordDefinition.length === 0 ? (
                        <div className="relative">
                          <div className="loader scale-50 translate-y-1"></div>
                        </div>
                      ) : (
                        <div className="">
                          <div className="text-sm text-cyan-400">
                            Word Definition
                          </div>
                          <div className="text-xs text-foreground/80">
                            Definition can be relative to any of the parts of
                            speech
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowHintsMenu(false);
                    // setShowAuthModal(true);
                  }}
                  className="text-sm bg-foreground/30 text-foreground px-3 py-2 rounded-md flex justify-center items-center gap-2 disabled:opacity-50 w-full disabled:pointer-events-none"
                >
                  {/* <Lock size={16}></Lock>  */}
                  <p>Cancel</p>
                </button>
                {/* <button
                  onClick={() => {
                    setShowHintsMenu(false);
                    setShowAuthModal(true);
                  }}
                  className="text-sm bg-foreground text-background px-3 py-2 rounded-md flex justify-center items-center gap-2 disabled:opacity-50 w-full disabled:pointer-events-none"
                >
                  <Lock size={16}></Lock> <p>Log in to unlock more hints</p>
                </button> */}
              </div>
            </div>
          </motion.div>
        </ModalContainer>

        <ModalContainer
          show={lose}
          setShow={setLose}
          preventClosingByClickingOnBackground
        >
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
            className="text-white bg-background p-8 px-5 max-md:px-3 rounded-md  flex justify-center items-center z-9999999999999999 pt-8 border-t-4 border-incorrect/40"
          >
            <div className="flex justify-center items-center flex-col gap-6 w-full min-w-84">
              <button
                onClick={() => {
                  setLose(false);
                }}
                className="flex justify-end items-center w-full text-foreground/50 absolute top-3 right-3 cursor-pointer"
              >
                <X></X>
              </button>
              <div className="text-incorrect bg-incorrect/10 p-2 rounded-lg w-fit">
                <Frown size={36}></Frown>
              </div>
              <div className="flex justify-center items-center flex-col">
                <div className="text-2xl">SO CLOSE!</div>
                <div className="text-sm">
                  Better luck next time! The word was:
                </div>
              </div>
              <div className="text-correct bg-foreground/5 border-dashed border-2 border-foreground/10 p-3 w-full text-center text-4xl rounded-lg gap-1 flex justify-center items-center font-semibold">
                {word.split("").map((x, i) => (
                  <p key={i}>{x}</p>
                ))}
              </div>
              <button
                onClick={callEndgame}
                className="flex gap-3 text-sm bg-incorrect p-3 w-full rounded-lg text-center justify-center items-center hover:opacity-70 duration-200"
              >
                <RotateCw size={20}></RotateCw> <p>Try again</p>
              </button>
            </div>
          </motion.div>
        </ModalContainer>
        <ModalContainer
          show={win}
          setShow={setWin}
          preventClosingByClickingOnBackground
        >
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
            className="text-white bg-background p-8 px-5 max-md:px-3 rounded-md  flex justify-center items-center z-9999999999999999 pt-8 border-t-4 border-correct/40"
          >
            <div className="flex justify-center items-center flex-col gap-6 w-full min-w-84">
              <button
                onClick={() => {
                  setWin(false);
                }}
                className="flex justify-end items-center w-full text-foreground/50 absolute top-3 right-3 cursor-pointer"
              >
                <X></X>
              </button>
              <div className="text-correct bg-correct/10 p-2 rounded-lg w-fit">
                <Trophy size={36}></Trophy>
              </div>
              <div className="flex justify-center items-center flex-col">
                <div className="text-2xl">YOU GOT IT!</div>
                <div className="text-sm">You played well, your score was:</div>
              </div>
              <div className="text-correct bg-foreground/5 border-dashed border-2 border-foreground/10 p-3 w-full text-center text-4xl rounded-lg gap-6 flex justify-center items-center font-semibold ">
                {life} <p className="text-xl">/</p> {chances}
              </div>
              <div>in finding the word:</div>
              <div className="text-correct bg-foreground/5 border-dashed border-2 border-foreground/10 p-3 w-full text-center text-4xl rounded-lg gap-1 flex justify-center items-center font-semibold">
                {word.split("").map((x, i) => (
                  <p key={i}>{x}</p>
                ))}
              </div>
              <button
                onClick={callEndgame}
                className="flex gap-3 text-sm bg-correct text-background p-3 w-full rounded-lg text-center justify-center items-center hover:opacity-70 duration-200"
              >
                <RotateCw size={20}></RotateCw> <p>New word</p>
              </button>
            </div>
          </motion.div>
        </ModalContainer>

        <div className="h-full pt-16 pb-6  min-h-screen w-full flex justify-center items-center relative">
          <input
            readOnly
            ref={keyboardRef}
            autoFocus
            type="text"
            className="opacity-0 pointer-events-none fixed"
            onKeyDown={(e) => {
              const code = e.code.replaceAll("Key", "");

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
              setTimeout(() => {
                setLastPressedKey(null);
              }, 100);
            }}
            name=""
            id=""
          />

          <div className="flex flex-col-reverse justify-center items-center h-full max-w-fit w-fit gap-3 relative">
            {addLetter && (
              <Keyboard
                submitAttempt={submitAttempt}
                letterStatus={attempts
                  .flat()
                  .filter((x) => x.letter && x.status)}
                addLetter={addLetter}
                removeLetter={removeLetter}
                lastPressedKey={lastPressedKey}
              ></Keyboard>
            )}

            {gameover ? (
              <div className="flex text-correct  min-h-10 gap-px text-xl">
                {word}
              </div>
            ) : (
              <div className="flex text-correct  min-h-10 gap-px text-xl">
                {currentStatus.map((x, i) => {
                  if (x) {
                    return <p key={i}>{x}</p>;
                  } else {
                    return <p key={i}>_</p>;
                  }
                })}
              </div>
            )}

            <GameGridComponent
              attempts={attempts}
              currentIndex={currentIndex}
              letterSizeForMobile={letterSizeForMobile}
              life={life}
              wordLength={wordLength}
            ></GameGridComponent>
            <div className="absolute -left-36 top-0 text-white py-2 flex flex-col -items-end gap-3 max-md:relative max-md:flex-row max-md:left-auto max-md:justify-end max-md:w-full max-md:px-3 ">
              {/* {gameover && !win && !lose && (
                <motion.button
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={callEndgame}
                  className="bg-correct/10 text-correct p-3 rounded-lg border  border-correct/40 flex gap-3 text-sm items-center"
                >
                  <RefreshCcw size={20}></RefreshCcw>
                  Play again
                </motion.button>
              )} */}
              {/* {!gameover && (
                <motion.button
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => {
                    setShowHintsMenu(true);
                  }}
                  className="bg-foreground/10 text-foreground p-3 rounded-lg border border-foreground/40 w-fit text-sm items-center flex gap-2"
                >
                  <Lightbulb size={20}></Lightbulb>
                  Hint
                </motion.button>
              )} */}
            </div>
          </div>
        </div>
      </main>
    );
});

// export const SinglePlayerTrialMode = memo(SinglePlayerTrialModeComponent);
