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

  return (
    <div
      id="virtual-keyboard"
      className=" min-h-36 min-w-lg max-md:min-w-fit flex-col space-y-1 max-md:space-y-0.5 max-md:w-screen max-md:px-3 "
    >
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          delay: 0.6,
        }}
        className="flex gap-1 max-md:gap-0.5 justify-center items-center max-md:justify-center"
      >
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
              addLetter={addLetter}
              key={letter}
              letter={letter}
              lastPressedKey={lastPressedKey}
              status={statusToPass}
            />
          );
        })}
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          delay: 0.7,
        }}
        className="flex gap-1 max-md:gap-0.5 justify-center items-center max-md:justify-center"
      >
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
              addLetter={addLetter}
              key={letter}
              letter={letter}
              lastPressedKey={lastPressedKey}
              status={statusToPass}
            />
          );
        })}
      </motion.div>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
          delay: 0.9,
        }}
        className="flex gap-1 max-md:gap-0.5 justify-center items-center max-md:justify-center"
      >
        <Key
          addLetter={addLetter}
          key={"enter"}
          letter={"Enter"}
          lastPressedKey={lastPressedKey}
          submitAttempt={submitAttempt}
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
              addLetter={addLetter}
              key={letter}
              letter={letter}
              lastPressedKey={lastPressedKey}
              status={statusToPass}
            />
          );
        })}
        <Key
          addLetter={addLetter}
          key={"Backspace"}
          removeLetter={removeLetter}
          letter={"Backspace"}
          lastPressedKey={lastPressedKey}
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
}: {
  letter: string;
  lastPressedKey: string | null;
  addLetter: (letter: string) => void;
  removeLetter?: () => void;
  submitAttempt?: () => void;
  status?: string;
}) {
  // console.log(letter.toUpperCase(), status);
  return (
    <motion.div
      key={letter}
      onClick={() => {
        if (letter !== "Enter" && letter !== "Backspace") {
          addLetter(letter.toUpperCase());
        }
        if (letter === "Backspace") {
          if (removeLetter) removeLetter();
        }
        if (letter === "Enter") {
          if (submitAttempt) submitAttempt();
        }
      }}
      whileTap={{
        scale: 0.85,
      }}
      animate={{
        scale: lastPressedKey?.toLowerCase() === letter.toLowerCase() ? 0.8 : 1,
      }}
      transition={{
        duration: 0.05,
      }}
      className={`p-3    py-3 border border-foreground/30  max-md:text-xs text-sm  min-w-12 max-md:min-w-6 max-md:w-full  max-md:h-16  ${(letter === "Enter" || letter === "Backspace") && "max-md:min-w-13 max-md:text-[.6em]"}  max-md:px-0 w-fit   flex justify-center items-center  rounded-xl max-md:rounded-lg uppercase font-semibold cursor-pointer select-none    ${letter === "Enter" && "bg-linear-to-r to-emerald-500 from-green-600 text-white"}
${
  lastPressedKey?.toLowerCase() === letter.toLowerCase()
    ? "md:border-foreground/60 bg-foreground/20"
    : "border-background"
}
                    
${
  !status
    ? "bg-foreground/10 text-foreground"
    : status === "CORRECT"
      ? "bg-green text-background shadow-foreground/40"
      : status === "EXISTS"
        ? "bg-yellow text-foreground"
        : status === "INCORRECT"
          ? "bg-foreground/50 text-background shadow-foreground/30"
          : "bg-foreground/10"
}
`}
    >
      {letter !== "Backspace" ? letter : <Delete className="max-md:size-5" />}
    </motion.div>
  );
});
