import useGameData from "@/context/GameDataContext";
import { Delete } from "lucide-react";
import { motion } from "motion/react";
import { memo } from "react";

const qwertyLettersRow1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const qwertyLettersRow2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const qwertyLettersRow3 = ["z", "x", "c", "v", "b", "n", "m"];

export const Keyboard = memo(function KeyboardComponent({
  lastPressedKey,
  addLetter,
  removeLetter,
  letterStatus,
  submitAttempt,
}: {
  lastPressedKey: string | null;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitAttempt: () => void;
  letterStatus: { letter: string; status: string }[];
}) {
  // console.log(letterStatus);
  const { gameSettings } = useGameData()!;

  return (
    <div
      id="virtual-keyboard"
      className=" min-h-36 min-w-lg max-md:min-w-fit flex-col space-y-1 max-md:space-y-1 max-md:w-screen max-md:px-1 "
    >
      <motion.div className="flex gap-1 max-md:gap-1 justify-center items-center max-md:justify-center">
        {qwertyLettersRow1.map((letter) => {
          let status = letterStatus
            .filter((x) => x.letter === letter.toUpperCase())
            .map((x) => x.status);

          const statusToPass = status.includes("CORRECT")
            ? "CORRECT"
            : status.includes("EXISTS")
              ? "EXISTS"
              : status.includes("INCORRECT")
                ? "INCORRECT"
                : "";
          // console.log(statusToPass);
          return (
            <Key
              animation={
                gameSettings.keyboard_animations === "true" ? true : false
              }
              addLetter={addLetter}
              key={letter}
              letter={letter}
              lastPressedKey={lastPressedKey}
              status={statusToPass}
              onClick={() => {
                addLetter(letter.toUpperCase());
                if (gameSettings.haptics === "true") navigator.vibrate(50);
              }}
            />
          );
        })}
      </motion.div>
      <motion.div className="flex gap-1 max-md:gap-1 justify-center items-center max-md:justify-center">
        {qwertyLettersRow2.map((letter) => {
          let status = letterStatus
            .filter((x) => x.letter === letter.toUpperCase())
            .map((x) => x.status);
          const statusToPass = status.includes("CORRECT")
            ? "CORRECT"
            : status.includes("EXISTS")
              ? "EXISTS"
              : status.includes("INCORRECT")
                ? "INCORRECT"
                : "";

          return (
            <Key
              animation={
                gameSettings.keyboard_animations === "true" ? true : false
              }
              addLetter={addLetter}
              key={letter}
              letter={letter}
              lastPressedKey={lastPressedKey}
              status={statusToPass}
              onClick={() => {
                addLetter(letter.toUpperCase());
                if (gameSettings.haptics === "true") navigator.vibrate(50);
              }}
            />
          );
        })}
      </motion.div>
      <motion.div className="flex gap-1 max-md:gap-1 justify-center items-center max-md:justify-center">
        <Key
          animation={gameSettings.keyboard_animations === "true" ? true : false}
          addLetter={addLetter}
          key={"enter"}
          letter={"Enter"}
          lastPressedKey={lastPressedKey}
          submitAttempt={submitAttempt}
          onClick={() => {
            submitAttempt();
            if (gameSettings.haptics === "true") navigator.vibrate(50);
          }}
        />
        {qwertyLettersRow3.map((letter) => {
          let status = letterStatus
            .filter((x) => x.letter === letter.toUpperCase())
            .map((x) => x.status);
          const statusToPass = status.includes("CORRECT")
            ? "CORRECT"
            : status.includes("EXISTS")
              ? "EXISTS"
              : status.includes("INCORRECT")
                ? "INCORRECT"
                : "";

          return (
            <Key
              animation={
                gameSettings.keyboard_animations === "true" ? true : false
              }
              addLetter={addLetter}
              key={letter}
              letter={letter}
              lastPressedKey={lastPressedKey}
              status={statusToPass}
              onClick={() => {
                addLetter(letter.toUpperCase());
                if (gameSettings.haptics === "true") navigator.vibrate(50);
              }}
            />
          );
        })}
        <Key
          animation={gameSettings.keyboard_animations === "true" ? true : false}
          addLetter={addLetter}
          key={"Backspace"}
          removeLetter={removeLetter}
          letter={"Backspace"}
          lastPressedKey={lastPressedKey}
          onClick={() => {
            removeLetter();
            if (gameSettings.haptics === "true") navigator.vibrate(50);
          }}
        />
      </motion.div>
    </div>
  );
});

export const Key = memo(function KeyComponent({
  letter,
  lastPressedKey,
  addLetter,
  status,
  removeLetter,
  submitAttempt,
  onClick,
  animation,
}: {
  letter: string;
  lastPressedKey: string | null;
  addLetter: (letter: string) => void;
  removeLetter?: () => void;
  submitAttempt?: () => void;
  status?: string;
  onClick: () => void;
  animation: boolean;
}) {
  // console.log(letter.toUpperCase(), status);
  return (
    <motion.div
      key={letter}
      onClick={() => {
        onClick();
      }}
      className={` active:bg-foreground/20 dark:active:bg-background/50  border border-foreground/30 dark:border-background/20  max-md:text-lg text-sm  min-w-12 max-md:min-w-6 max-md:w-full  max-md:h-16  ${(letter === "Enter" || letter === "Backspace") && "max-md:min-w-13 max-md:text-[.6em]"}  max-md:px-0 w-fit   flex justify-center items-center  rounded-sm max-md:rounded-md uppercase font-semibold cursor-pointer select-none    ${letter === "Enter-" && "bg-linear-to-r to-emerald-500 from-green-600 text-white"}
${
  lastPressedKey?.toLowerCase() === letter.toLowerCase()
    ? "md:border-foreground/60 bg-foreground/20"
    : "border-background"
}
                    
${
  !status
    ? "bg-foreground/10 text-foreground dark:bg-background/20 dark:text-background"
    : status === "CORRECT"
      ? "bg-green text-background shadow-foreground/40 dark:text-foreground"
      : status === "EXISTS"
        ? "bg-yellow text-foreground "
        : status === "INCORRECT"
          ? "bg-foreground/50 text-background shadow-foreground/30 dark:bg-background/10 "
          : "bg-foreground/10"
}
`}
    >
      {letter !== "Backspace" ? letter : <Delete className="max-md:size-5" />}
    </motion.div>
  );
});
