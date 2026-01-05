"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import wordExists from "@/utils/checkWord";

export default function Home() {
  const [word, setWord] = useState("paste".toUpperCase());
  const [chances, setChances] = useState(6);
  const [life, setLife] = useState(0);

  const layout = new Array(chances)
    .fill("")
    .map((x) => [
      ...new Array(word.split("").length).fill({ letter: "", status: "" }),
    ]);

  let [attempts, setAttempts] =
    useState<{ letter: string; status: string }[][]>(layout);

  useEffect(() => {
    // console.log(...attempts[0]);
  }, [attempts]);

  const [currentIndex, setCurrentIndex] = useState(0);
  // console.log(attempts);

  function addLetter(letter: string) {
    if (currentIndex < word.length) {
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
        })
      );
    }
  }

  function removeLetter() {
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
        })
      );
    }
  }

  function submitAttempt() {
    if (life < chances) {
      if (attempts[life].filter((x) => x.letter === "").length > 0) {
        toast("Finish the word atleast?", {
          style: {
            background: "#1a1a1a",
            color: "#ffffff",
            boxShadow: "none",
            filter: "none",
            borderRadius: "3px",
          },
          position: "bottom-center",
        });
      } else {
        if (
          wordExists(attempts[life].map((x) => x.letter).join(""))
          // true
        ) {
          const wordArray = word.split("");
          const attemptArray = attempts[life].map((x) => x.letter);
          for (let idx = 0; idx < word.length; idx++) {
            // !@ts-ignore
            setAttempts((org) =>
              org.map((x, i) => {
                if (i === life) {
                  return x.map((y, i) => {
                    if (i === idx) {
                      if (!wordArray.includes(attemptArray[idx])) {
                        return {
                          ...y,
                          status: "INCORRECT",
                        };
                      } else if (wordArray[idx] === attemptArray[idx]) {
                        return {
                          ...y,
                          status: "CORRECT",
                        };
                      } else if (
                        // wordArray.filter((x) => x === attemptArray[idx])
                        //   .length ===
                        //   attemptArray.filter((x) => x === attemptArray[idx])
                        //     .length &&
                        wordArray.includes(attemptArray[idx])
                      ) {
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
              })
            );
          }
          setLife((org) => org + 1);
          setCurrentIndex(0);
        } else {
          toast("Not a word bruv.", {
            style: {
              background: "#1a1a1a",
              color: "#ffffff",
              boxShadow: "none",
              filter: "none",
              borderRadius: "3px",
            },
            position: "bottom-center",
          });
        }
      }
    }
  }

  // console.log(attempts);

  const keyboardRef = useRef<HTMLInputElement>(null);

  const letters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  return (
    <main
      onClick={() => {
        if (keyboardRef.current) keyboardRef.current.focus();
      }}
      className="h-svh w-screen overflow-hidden flex justify-center items-center flex-col "
    >
      {/* <div className="mb-6 text-4xl  text-center  w-full font-semibold flex justify-center items-center h-16 fixed top-0">
        <img className="w-8 mx-3" src="/logo.svg" alt="" /> ARIWA
      </div> */}
      <div className="h-full w-full">
        <input
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
              if (letters.includes(code)) {
                addLetter(code);
              }
              if (e.code === "Backspace") {
                removeLetter();
              }
            }
          }}
          name=""
          id=""
        />
        <div className="gap-1 flex flex-col  p-6 h-full justify-center items-center">
          {attempts.map((atp, j) => {
            return (
              <div key={j} className="flex items-center justify-center  gap-1">
                {atp.map((word, i) => {
                  return (
                    <motion.div
                      initial={{
                        scale: 1,
                      }}
                      animate={{
                        scale: j !== life ? 1 : currentIndex === i ? 0.96 : 1,
                      }}
                      key={i}
                      className={`h-16 aspect-square border text-center flex justify-center items-center text-2xl font-semibold rounded-md
                      ${
                        j !== life
                          ? word.status === "CORRECT"
                            ? "bg-green-800 text-foreground"
                            : word.status === "INCORRECT"
                            ? "opacity-50 bg-foreground/10   text-foreground"
                            : word.status === "EXISTS"
                            ? "bg-amber-500 text-foreground"
                            : ""
                          : word.letter === ""
                          ? ""
                          : "bg-foreground/10 "
                      }
                      ${
                        j !== life
                          ? "border-foreground/30"
                          : currentIndex === i
                          ? "border-foreground"
                          : "border-foreground/30"
                      } duration-150`}
                    >
                      {word.letter}
                      {/* { currentIndex === i ? word.letter : "-"} */}
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="text-white h-full ">d</div>
      </div>
    </main>
  );
}
