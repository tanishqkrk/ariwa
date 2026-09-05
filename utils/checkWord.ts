// ======= Word checker based on older json ===========

import dictionary from "@/utils/dictionary.json";
import words from "@/utils/words.json";

const wordExists = (text: string) => {
  const cleaned = text.trim().toLowerCase();

  return (
    !!(cleaned.length > 1
      ? (dictionary as any)[cleaned.slice(0, 2)] &&
        (dictionary as any)[cleaned.slice(0, 2)].includes(cleaned)
      : cleaned === "a" || cleaned === "i") ||
    (words.map((w) => w.word).includes(text) &&
      words.filter(
        (x) => x.word.toLocaleLowerCase() === cleaned.toLocaleLowerCase(),
      ))
  );
};

export default wordExists;
