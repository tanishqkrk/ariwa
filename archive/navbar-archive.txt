"use client";

import { AnimatePresence, motion } from "motion/react";
import { doc, setDoc } from "firebase/firestore";
import {
  ALargeSmall,
  Annoyed,
  ChevronDown,
  ChevronRight,
  CircleQuestionMark,
  Heart,
  Repeat,
  Settings2,
  User,
  UserCircle,
  Users,
  Volume,
  Volume2,
  Volume2Icon,
  VolumeOff,
  X,
} from "lucide-react";
import { db } from "@/firebase";
import { useState } from "react";
import ModalContainer from "./Modal";
import AuthPopup from "./AuthModalUI";
import Logo from "@/public/Logo";
import useSinglePlayerData from "@/context/GameDataContext";
import Image from "next/image";
import { gameRoomID } from "@/lib/generateRoomID";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const {
    showAuthModal,
    setShowAuthModal,
    wordLength,
    chances,
    setSoundEffect,
    soundEffect,
    resetWord,
  } = useSinglePlayerData()!;

  const router = useRouter();

  const [showGameSettings, setShowGameSettings] = useState(false);

  const [createRoomPrompt, setCreateRoomPrompt] = useState(false);

  const [localWordLength, setLocalWordLength] = useState(wordLength);
  const [localChances, setLocalChances] = useState(chances);

  const [showGuide, setShowGuide] = useState(false);

  const [initialRoomSettings, setInitialRoomSettings] = useState({
    avatar: 1,
    wordLength: 5,
    chances: 6,
    rounds: 1,
    name: "",
  });

  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  const [showNameError, setShowNameError] = useState(false);

  const path = usePathname();

  return (
    <div className="relative">
      <ModalContainer
        preventClosingByClickingOnBackground
        show={showGameSettings}
        setShow={setShowGameSettings}
        className="max-h-[80vh] noscroll overflow-y-scroll overflow-x-hidden "
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
          className="text-white bg-background p-8 px-5 max-md:px-3 rounded-md  flex justify-center items-center z-9999999999999999 pt-8  "
        >
          <div className="flex justify-center items-center flex-col gap-8 w-full min-w-110 max-md:min-w-84 max-md:w-fit ">
            <button
              onClick={() => {
                setShowGameSettings(false);
                setLocalWordLength(wordLength);
                setLocalChances(chances);
              }}
              className="flex justify-end items-center w-full text-foreground/50 absolute top-3 right-3 cursor-pointer"
            >
              <X></X>
            </button>
            <div className="w-full">
              <div className="text-xl font-semibold text-left w-full">
                Game Settings
              </div>
              <div className="text-sm  text-left w-full">
                Saving these will reset the current game state.
              </div>
            </div>
            <div className="w-full space-y-5">
              <div className="flex justify-start items-center w-full gap-3">
                <div className="text-foreground bg-foreground/10 p-2 rounded-lg  --shadow-inner--  shadow-foreground/20">
                  <ALargeSmall size={26}></ALargeSmall>
                </div>
                <div className="flex flex-col gap-px">
                  <div className="text-sm">Word Length</div>
                  <div className="text-xs">
                    Choose how many letters to guess
                  </div>
                </div>
              </div>
              <div className="flex justify-between w-full items-center flex-col">
                <div className="flex gap-3 w-full justify-center items-center">
                  {[3, 4, 5, 6, 7, 8].map((x) => {
                    return (
                      <motion.button
                        whileTap={{
                          scale: 0.95,
                        }}
                        transition={{
                          duration: 0.4,
                        }}
                        onClick={() => {
                          setLocalWordLength(x);
                        }}
                        key={x}
                        className={`w-10  text-center  --shadow-inner--   aspect-square  rounded-lg cursor-pointer ${localWordLength === x ? "bg-foreground/70 text-background shadow-foreground" : "bg-foreground/10 shadow-foreground/10"}`}
                      >
                        {x}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full space-y-5 flex items-center justify-between flex-col">
              <div className="flex justify-start items-center w-full gap-3">
                <div className="text-foreground bg-foreground/10 p-2 rounded-lg  --shadow-inner--  shadow-foreground/20">
                  <Heart size={26}></Heart>
                </div>
                <div className="flex flex-col gap-px">
                  <div className="text-sm">Attempts</div>
                  <div className="text-xs">
                    Choose how many times you can try
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3 w-full  items-center">
                <motion.button
                  whileTap={{
                    scale: 0.95,
                  }}
                  disabled={localChances === 1}
                  onClick={() => {
                    if (localChances > 1) setLocalChances((org) => org - 1);
                  }}
                  className="cursor-pointer border border-foreground/10 bg-foreground/30 p-2 rounded-lg  text-center flex justify-center items-center min-w-8 w-1/4 h-full select-none disabled:opacity-45  --shadow-inner--  shadow-foreground/20"
                >
                  -
                </motion.button>
                <div className="text-center min-w-6 ">{localChances}</div>
                <motion.button
                  whileTap={{
                    scale: 0.95,
                  }}
                  disabled={localChances === 10}
                  onClick={() => {
                    if (localChances < 10) setLocalChances((org) => org + 1);
                  }}
                  className="cursor-pointer border border-foreground/10 bg-foreground/30 p-2 rounded-lg  text-center flex justify-center items-center min-w-8 w-1/4 h-full select-none disabled:opacity-45  --shadow-inner--  shadow-foreground/20"
                >
                  +
                </motion.button>
              </div>
            </div>
            <div className="w-full flex items-center justify-between hidden">
              <div className="flex justify-start items-center w-full gap-3">
                <div className="text-foreground bg-foreground/10 p-2 rounded-lg  --shadow-inner--  shadow-foreground/20">
                  <Volume2 size={26}></Volume2>
                </div>
                <div className="flex flex-col gap-px">
                  <div className="text-sm">Sound effects</div>
                </div>
              </div>
              <div className="flex w-full space-x-2 text-center bg-foreground/10 p-1 rounded-lg">
                <button
                  onClick={() => {}}
                  className={`w-1/2  text-sm   h-full rounded-md p-1 ${soundEffect === 1 && "bg-correct  text-black  --shadow-inner--  shadow-foreground/40"} `}
                >
                  On
                </button>
                <button
                  onClick={() => {}}
                  className={`w-1/2 text-foreground/50 text-sm   h-full rounded-md p-1 ${soundEffect === 0 && "bg-background/80  text-black  --shadow-inner--  shadow-foreground/5"} `}
                >
                  Off
                </button>
              </div>
            </div>
            <motion.button
              whileTap={{
                scale: 0.95,
              }}
              onClick={() => {
                resetWord(localWordLength, localChances);
                setShowGameSettings(false);
                localStorage.setItem("length", localWordLength.toString());
                localStorage.setItem("chances", localChances.toString());
              }}
              className="flex gap-3 text-sm bg-foreground/80 p-3 w-full rounded-lg text-center justify-center items-center hover:opacity-70  text-background  --shadow-inner--  shadow-foreground"
            >
              <p>Save Changes</p>
            </motion.button>
          </div>
        </motion.div>
      </ModalContainer>
      <ModalContainer
        // preventClosingByClickingOnBackground
        show={createRoomPrompt}
        setShow={setCreateRoomPrompt}
        className="max-h-[90vh] noscroll overflow-y-scroll overflow-x-hidden"
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
          className="text-white bg-background p-8 px-5 max-md:px-6 rounded-xl  flex justify-center items-center z-9999999999999999 pt-8"
        >
          <div className="flex justify-center items-center flex-col gap-8 w-full min-w-110 max-md:min-w-84 max-md:w-70">
            <button
              onClick={() => {
                setCreateRoomPrompt(false);
              }}
              className="flex justify-end items-center w-full text-foreground/50 absolute top-3 right-3 cursor-pointer"
            >
              <X></X>
            </button>
            <div className="w-full">
              <div className="text-xl font-semibold text-left w-full capitalize">
                Start a new room
              </div>
              <div className="text-sm  text-left w-full ">
                and play with friends
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="flex flex-col justify-start items-start w-full text-sm gap-2">
                <div>Choose a name</div>
                <input
                  value={initialRoomSettings.name}
                  onChange={(e) => {
                    setInitialRoomSettings((org) => ({
                      ...org,
                      name: e.target.value,
                    }));
                  }}
                  type="text"
                  placeholder="Unga Bunga"
                  className={`w-full bg-foreground/10 py-3 rounded-lg border  --shadow-inner--  shadow-foreground/10 border-foreground/5 pl-2 ${showNameError && "border-2 border-red-500 shadow-red-900"}`}
                />
                {showNameError && (
                  <div className="text-red-500">Please fill in name</div>
                )}
              </div>
              <div className="flex flex-col justify-start items-start w-full text-sm gap-2">
                <div>Choose an avatar</div>
                <div className="flex max-w-110 overflow-x-scroll gap-3 customscroll py-3 px-3">
                  {new Array(16).fill("").map((x, i) => {
                    return (
                      <motion.div
                        key={i + 1}
                        whileTap={{
                          scale: 0.95,
                        }}
                        onClick={() => {
                          setInitialRoomSettings((org) => ({
                            ...org,
                            avatar: i + 1,
                          }));
                        }}
                        className=" --shadow-inner--  shadow-foreground/50 rounded-full p-1"
                      >
                        <Image
                          className={`min-w-16 cursor-pointer ${initialRoomSettings.avatar === i + 1 ? "border-4 border-correct   --shadow-inner--  shadow-foreground rounded-full scale-120" : "scale-90 opacity-80"}`}
                          src={`/avatars/${i + 1}.svg`}
                          alt=""
                          width={800}
                          height={800}
                        ></Image>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <motion.button
                whileTap={{
                  scale: 0.95,
                }}
                onClick={async () => {
                  if (initialRoomSettings.name.length === 0) {
                    setShowNameError(true);
                    toast.error("What's your name?", {
                      icon: <Annoyed strokeWidth="1" color="#ffffff"></Annoyed>,
                      style: {
                        background: "#1a1a1a",
                        color: "#ffffff",
                        boxShadow: "none",
                        filter: "none",
                        borderRadius: "8px",
                        border: "1px solid #ffffff10",
                      },
                      position: "top-center",
                    });
                    return;
                  }
                  setShowNameError(false);

                  try {
                    const roomID = (await gameRoomID()).toUpperCase();
                    await setDoc(doc(db, "gameRooms", roomID), {
                      roomID,
                      roomSettings: {
                        wordLength: initialRoomSettings.wordLength,
                        chances: initialRoomSettings.chances,
                        rounds: initialRoomSettings.rounds,
                      },
                      roomMembers: [
                        {
                          id: 1,
                          name: initialRoomSettings.name,
                          avatar: `/avatars/${initialRoomSettings.avatar}.svg`,
                          admin: true,
                        },
                      ],
                    });

                    setCreateRoomPrompt(false);
                    router.push("/joinRoom/" + roomID);
                  } catch (err) {
                    console.log(err);
                  }
                }}
                className="flex gap-3 text-sm bg-correct p-3 w-full rounded-lg text-center justify-center items-center hover:opacity-70  text-background  --shadow-inner--  shadow-foreground/30"
              >
                <p>Create Room</p>
              </motion.button>
              <button
                onClick={() => {
                  setIsSettingsExpanded((x) => !x);
                }}
                className="flex text-sm items-center gap-3"
              >
                Room Settings{" "}
                {!isSettingsExpanded ? (
                  <ChevronRight size={16}></ChevronRight>
                ) : (
                  <ChevronDown></ChevronDown>
                )}
              </button>
              {isSettingsExpanded && (
                <div className="w-full space-y-5">
                  <div className="flex justify-start items-center w-full gap-3">
                    <div className="text-foreground bg-foreground/10 p-2 rounded-lg  --shadow-inner--  shadow-foreground/20">
                      <ALargeSmall size={26}></ALargeSmall>
                    </div>
                    <div className="flex flex-col gap-px">
                      <div className="text-sm">Word Length</div>
                      <div className="text-xs">
                        Choose how many letters to guess
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between w-full items-center flex-col">
                    <div className="flex gap-3 w-full justify-center items-center">
                      {[3, 4, 5, 6, 7, 8].map((x) => {
                        return (
                          <motion.button
                            whileTap={{
                              scale: 0.95,
                            }}
                            transition={{
                              duration: 0.4,
                            }}
                            onClick={() => {
                              setInitialRoomSettings((org) => ({
                                ...org,
                                wordLength: x,
                              }));
                              // setLocalWordLength(x);
                            }}
                            key={x}
                            className={`w-10  text-center  --shadow-inner--   aspect-square  rounded-lg cursor-pointer ${initialRoomSettings.wordLength === x ? "bg-foreground/70 text-background shadow-foreground" : "bg-foreground/10 shadow-foreground/10"}`}
                          >
                            {x}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-full space-y-5 flex items-center justify-between flex-col">
                    <div className="flex justify-start items-center w-full gap-3">
                      <div className="text-foreground bg-foreground/10 p-2 rounded-lg  --shadow-inner--  shadow-foreground/20">
                        <Heart size={26}></Heart>
                      </div>
                      <div className="flex flex-col gap-px">
                        <div className="text-sm">Attempts</div>
                        <div className="text-xs">
                          Choose how many times you can try
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3 w-full  items-center">
                      <motion.button
                        whileTap={{
                          scale: 0.95,
                        }}
                        disabled={initialRoomSettings.chances === 1}
                        onClick={() => {
                          if (initialRoomSettings.chances > 1)
                            setInitialRoomSettings((org) => ({
                              ...org,
                              chances: org.chances - 1,
                            }));
                        }}
                        className="cursor-pointer border border-foreground/10 bg-foreground/30 p-2 rounded-lg  text-center flex justify-center items-center min-w-8 w-1/4 h-full select-none disabled:opacity-45  --shadow-inner--  shadow-foreground/20"
                      >
                        -
                      </motion.button>
                      <div className="text-center min-w-6 ">
                        {initialRoomSettings.chances}
                      </div>
                      <motion.button
                        whileTap={{
                          scale: 0.95,
                        }}
                        disabled={initialRoomSettings.chances === 10}
                        onClick={() => {
                          if (initialRoomSettings.chances < 10)
                            setInitialRoomSettings((org) => ({
                              ...org,
                              chances: org.chances + 1,
                            }));
                        }}
                        className="cursor-pointer border border-foreground/10 bg-foreground/30 p-2 rounded-lg  text-center flex justify-center items-center min-w-8 w-1/4 h-full select-none disabled:opacity-45  --shadow-inner--  shadow-foreground/20 "
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                  <div className="w-full space-y-5 flex items-center justify-between flex-col">
                    <div className="flex justify-start items-center w-full gap-3">
                      <div className="text-foreground bg-foreground/10 p-2 rounded-lg  --shadow-inner--  shadow-foreground/20">
                        <Repeat size={26}></Repeat>
                      </div>
                      <div className="flex flex-col gap-px">
                        <div className="text-sm">Rounds</div>
                        <div className="text-xs">
                          How many rounds in the game
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3 w-full  items-center">
                      <motion.button
                        whileTap={{
                          scale: 0.95,
                        }}
                        disabled={initialRoomSettings.rounds === 1}
                        onClick={() => {
                          if (initialRoomSettings.rounds > 1)
                            setInitialRoomSettings((org) => ({
                              ...org,
                              rounds: org.rounds - 1,
                            }));
                        }}
                        className="cursor-pointer border border-foreground/10 bg-foreground/30 p-2 rounded-lg  text-center flex justify-center items-center min-w-8 w-1/4 h-full select-none disabled:opacity-45  --shadow-inner--  shadow-foreground/20"
                      >
                        -
                      </motion.button>
                      <div className="text-center min-w-6 ">
                        {initialRoomSettings.rounds}
                      </div>
                      <motion.button
                        whileTap={{
                          scale: 0.95,
                        }}
                        disabled={initialRoomSettings.rounds === 10}
                        onClick={() => {
                          if (initialRoomSettings.rounds < 10)
                            setInitialRoomSettings((org) => ({
                              ...org,
                              rounds: org.rounds + 1,
                            }));
                        }}
                        className="cursor-pointer border border-foreground/10 bg-foreground/30 p-2 rounded-lg  text-center flex justify-center items-center min-w-8 w-1/4 h-full select-none disabled:opacity-45  --shadow-inner--  shadow-foreground/20"
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </ModalContainer>
      <ModalContainer
        // preventClosingByClickingOnBackground
        show={showGuide}
        setShow={setShowGuide}
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
          <div className="">
            <div className="text-lg font-semibold capitalize">How to play?</div>
            <div>Guess the word in {wordLength} of tries</div>
          </div>
          <div></div>
        </motion.div>
      </ModalContainer>
      <ModalContainer show={showAuthModal} setShow={setShowAuthModal}>
        <AuthPopup></AuthPopup>
      </ModalContainer>
      <div className="fixed  w-full flex justify-between items-center py-2  z-9999 px-3 bg-background lg:max-w-[80vw] xl:max-w-[80vw] left-1/2  -translate-x-1/2">
        <div className="w-1/3 max-md:hidden"></div>
        <div className="flex justify-center items-center gap-3 w-1/3 max-md:w-fit">
          <Logo size={36}></Logo>
          <div className="font-bold flex text-xl max-md:hidden ">
            <p className="--text-correct-- text-white/70 ">WORD</p>
            <p className="--text-incorrect-- text-white/70 ">RUSH</p>
          </div>
        </div>

        <div className="w-1/3 flex justify-end items-center gap-3 max-md:w-3/4">
          <button
            onClick={() => {
              setShowGuide(true);
            }}
            className="text-white/70 hidden"
          >
            <CircleQuestionMark size={30}></CircleQuestionMark>
          </button>
          {path === "/play" && (
            <div className="flex justify-center items-center gap-3">
              {/* <motion.button
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
                  setCreateRoomPrompt(true);
                }}
                disabled
                className="bg-foreground/80 text-background p-2 rounded-lg border border-foreground/40 w-fit text-sm flex items-center gap-2   --shadow-inner--  shadow-foreground disabled:bg-foreground/0 disabled:border-foreground/20  disabled:cursor-default
                "
              >
                Join a Room
              </motion.button> */}
            </div>
          )}
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
              setShowGameSettings(true);
            }}
            className="bg-foreground/20 text-foreground p-2 rounded-lg border border-foreground/10 w-fit text-sm flex items-center gap-2  --shadow-inner--  shadow-foreground/10"
          >
            <Settings2 size={20}></Settings2>
            Settings
          </motion.button>
          <motion.button
            whileTap={{
              scale: 0.9,
            }}
            onClick={() => {
              if (soundEffect === 1) {
                setSoundEffect(0);
                localStorage.setItem("sounds", "0");
              }
              if (soundEffect === 0) {
                setSoundEffect(1);
                localStorage.setItem("sounds", "1");
              }
            }}
            className={`text-sm  px-3 py-2 rounded-md flex justify-center  items-center gap-2 disabled:opacity-50 ${soundEffect === 1 ? "bg-correct/70 text-foreground" : " text-foreground"}`}
          >
            {soundEffect === 0 ? (
              <VolumeOff size={16}></VolumeOff>
            ) : (
              <Volume2Icon size={16}></Volume2Icon>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
