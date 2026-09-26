// ======= Word dictionary based on older json ===========

// import dictionary from "@/utils/dictionary.json";

// function generatePot(len: number): string[] {
//   return Object.values(dictionary)[
//     Math.floor(Math.random() * Object.values(dictionary).length + 0)
//   ].filter((x: string) => x.length === len);
// }

// export function generateRandomWord(length: number) {
//   let pot = generatePot(length);
//   while (pot.length < 8) {
//     pot = generatePot(length);
//   }

//   const randomWord = pot[Math.floor(Math.random() * pot.length + 0)];

//   return randomWord;
// }

// ======= Word dictionary based on new json with better words ===========

import dictionary from "@/utils/words.json";

export async function generateRandomWord(length: number) {
  const pot = dictionary
    .filter((x) => x.word.split("").length === length)
    .filter((x) => !x.word.split("").includes("-"));

  const luckyLad = pot[Math.floor(Math.random() * pot.length + 0)];

  return luckyLad;
}
