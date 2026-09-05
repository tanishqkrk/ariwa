"use client";

import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";

const GameGridComponent = memo(function GameGridComponent({
  attempts,
  life,
  currentIndex,
  letterSizeForMobile,
  wordLength,
}: {
  attempts: { letter: string; status: string }[][];
  life: number;
  currentIndex: number;
  letterSizeForMobile: string[];
  wordLength: number;
}) {
  return (
    <div className="gap-1 flex flex-col    justify-center items-center">
      {attempts.map((atp, j) => {
        return (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1 * (j + 1),
            }}
            key={j}
            className="flex items-center justify-center  gap-1 "
          >
            {atp.map((word, i) => {
              return (
                <motion.div
                  initial={{
                    scale: 1,
                  }}
                  animate={{
                    scale: j !== life ? 1 : currentIndex === i ? 0.95 : 1,
                  }}
                  key={i}
                  className={`h-16 ${
                    letterSizeForMobile[wordLength]
                  } aspect-square   text-center flex justify-center items-center text-xl max-md:text-xl font-bold rounded-xl  
                  border border-foreground/50
                        ${
                          j === life
                            ? word.letter === ""
                              ? "text-foreground"
                              : "bg-foreground/10 text-foreground"
                            : word.status === "CORRECT"
                              ? "bg-green text-background"
                              : word.status === "INCORRECT"
                                ? "bg-foreground/60 text-background opacity-50 "
                                : word.status === "EXISTS"
                                  ? "bg-yellow text-foreground "
                                  : "bg-foreground/20"
                        }
                        ${
                          j === life
                            ? currentIndex === i
                              ? "bg-foreground/30"
                              : "bg-foreground/10 "
                            : ""
                        } duration-100 `}
                >
                  {word.letter}
                </motion.div>
              );
            })}
          </motion.div>
        );
      })}
    </div>
  );
});

export default GameGridComponent;
