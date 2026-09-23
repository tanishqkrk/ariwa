import { useState } from "react";

function formatSecondsToString(seconds: number) {
  if (seconds > 59) {
    const secondsToMinsToArray = (seconds / 60).toString().split(".");

    if (seconds % 60 === 0) {
      return (seconds / 60).toString() + ":00";
    } else {
      const remainderDecimalToSeconds = Math.floor(
        ((parseInt(
          secondsToMinsToArray[1].toString().split("").splice(0, 2).join(""),
        ) +
          1) *
          60) /
          100,
      );
      if (remainderDecimalToSeconds < 10) {
        return secondsToMinsToArray[0] + ":" + "0" + remainderDecimalToSeconds;
      } else {
        return secondsToMinsToArray[0] + ":" + remainderDecimalToSeconds;
      }
    }
  } else {
    if (seconds > 9) {
      return "00:" + seconds.toString();
    } else {
      return "00:" + "0" + seconds.toString();
    }
  }
}

function convertEpochDifferenceIntoSeconds(
  startTimeEpoch: number,
  endTimeEpoch: number,
) {
  return Math.floor(Math.abs(endTimeEpoch - startTimeEpoch) / 1000);
}

export default function useStopwatch() {
  const [startTimeEpoch, setStartTimeEpoch] = useState(0);
  const [endTimeEpoch, setEndTimeEpoch] = useState(0);
  return {
    formatSecondsToString,
    convertEpochDifferenceIntoSeconds,
    startTimeEpoch,
    setStartTimeEpoch,
    endTimeEpoch,
    setEndTimeEpoch,
  };
}
