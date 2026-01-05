import dictionary from "@/utils/dictionary.json";

const wordExists = (text: string) => {
  const cleaned = text.trim().toLowerCase();

  return !!(cleaned.length > 1
    ? (dictionary as any)[cleaned.slice(0, 2)] &&
      (dictionary as any)[cleaned.slice(0, 2)].includes(cleaned)
    : cleaned === "a" || cleaned === "i");
};

export default wordExists;
