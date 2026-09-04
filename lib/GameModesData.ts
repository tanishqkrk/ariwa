import {
  AlarmClock,
  CalendarDays,
  Gamepad2,
  LucideProps,
  Scaling,
  Swords,
} from "lucide-react";

export interface GameModeDisplay {
  title: string;
  id: string;
  icon: React.FC<LucideProps>;
  img?: string;
  description: string;
  slug: string;
  cta: string;
  color: string;
  disabled?: boolean;
}

export const SinglePlayerGameModes: GameModeDisplay[] = [
  {
    title: "Daily Word",
    id: "daily",
    icon: CalendarDays,
    description: "One word per day for you to dwell upon",
    slug: "daily-word",
    cta: "Guess today's word",
    color: "bg-gradient-to-b from-sky-700 to-blue-600",
    // disabled: true,
    img: "/daily.png",
  },
  {
    title: "Race Against Time",
    id: "race-against-time",
    icon: AlarmClock,
    description: "Guess as many words as you can under a time limit",
    slug: "race-against-time",
    cta: "Start guessing",
    color: "bg-gradient-to-b from-green-600 to-lime-500",
    img: "/race.png",
    // disabled: true,
  },
  {
    title: "Casual",
    id: "casual-mode",
    icon: Gamepad2,
    description: "No pressure, no points, just have some fun!",
    slug: "casual-mode",
    cta: "Have fun",
    color: "bg-gradient-to-b from-purple-600 to-fuchsia-400",
    img: "/casual.png",
  },
  {
    title: "Scale Up",
    id: "scale-up",
    icon: Scaling,
    description: "Go from 3 letter words to 9 letter words in a streak!",
    slug: "scale-up",
    cta: "Play Now",
    color: "bg-teal-400",
    // disabled: true,
  },
];
export const MultiPlayerGameModes: GameModeDisplay[] = [
  {
    title: "Battle ",
    id: "battle-mode",
    icon: Swords,
    description: "Clash against othher players to come on top",
    slug: "casual-mode",
    cta: "Clash",
    color: "bg-gradient-to-b from-orange-500 to-red-500",
    disabled: true,
    img: "/battle3.png",
  },
];
