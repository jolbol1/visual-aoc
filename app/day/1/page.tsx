"use client";
import { PartToolbar } from "@/components/part-toolbar";
import { Card } from "@/components/ui/card";
import { TextArea } from "@/components/ui/text-area";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { TextField } from "react-aria-components";

const exampleData = [
  "two1nine",
  "eightwothree",
  "abcone2threexyz",
  "xtwone3four",
  "4nineeightseven2",
  "zoneight234",
  "7pqrstsixteen",
  "twone",
  "1abc2",
  "pqr3stu8vwx",
  "a1b2c3d4e5f",
  "treb7uchet",
];

const matchSetDigits = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const maxSetNo = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

let sum = 0;
const trebuchet = (data: string[], matchArr: string[]) => {
  sum = 0;
  const x = data.map((current, index) => {
    const matchesFirst = matchArr.map((type) => current.indexOf(type));
    const matchesLast = matchArr.map((type) => current.lastIndexOf(type));

    const firstIndex = matchesFirst.findIndex(
      (x) => x === Math.min(...matchesFirst.filter((x) => x >= 0))
    );
    const lastIndex = matchesLast.findIndex(
      (x) => x === Math.max(...matchesLast)
    );

    const firstNumber = matchArr[firstIndex];
    const lastNumber = matchArr[lastIndex];

    const firstWordIndex = current.indexOf(firstNumber);
    const lastWordIndex = current.lastIndexOf(lastNumber);

    const first =
      firstIndex < 0 ? 0 : firstIndex > 8 ? firstIndex - 8 : firstIndex + 1;
    const last =
      lastIndex < 0 ? 0 : lastIndex > 8 ? lastIndex - 8 : lastIndex + 1;
    // console.log(current, parseInt(first.toString() + last.toString()));
    sum += parseInt(first.toString() + last.toString());

    // Check for overlap
    const overlapStart = Math.max(firstWordIndex, lastWordIndex);
    const overlapEnd = Math.min(
      firstWordIndex + firstNumber?.length,
      lastWordIndex + lastNumber?.length
    );

    let styledValue;
    if (overlapStart < overlapEnd) {
      // There is an overlap
      styledValue = (
        <p>
          {current.substring(0, firstWordIndex)}
          <span className="bg-yellow-300 text-black">
            {current.substring(firstWordIndex, overlapStart)}
          </span>
          <span className="bg-orange-400 text-black">
            {current.substring(overlapStart, overlapEnd)}
          </span>
          <span className="bg-red-400 text-black">
            {current.substring(overlapEnd, lastWordIndex + lastNumber.length)}
          </span>
          {current.substring(lastWordIndex + lastNumber.length)}
        </p>
      );
    } else {
      // No overlap
      styledValue = (
        <p>
          {current.substring(0, firstWordIndex)}
          <span className="bg-yellow-300 text-black">
            {current.substring(
              firstWordIndex,
              firstWordIndex + firstNumber?.length
            )}
          </span>
          {current.substring(
            firstWordIndex + firstNumber?.length,
            lastWordIndex
          )}
          <span className="bg-red-400 text-black">
            {current.substring(
              lastWordIndex,
              lastWordIndex + lastNumber.length
            )}
          </span>
          {current.substring(lastWordIndex + lastNumber.length)}
        </p>
      );
    }

    return (
      <div key={current} className="flex gap-6">
        {styledValue}
        <span className="text-gray-300">
          // Calibration Value: {parseInt(first.toString() + last.toString())}
        </span>
      </div>
    );
  });
  return x;
};

type DayOneProps = {
  searchParams: { part: "1" | "2" };
};

const example2 =
  "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen";

export default function DayOne({ searchParams }: DayOneProps) {
  const [values, setValues] = useState(
    searchParams.part === "2"
      ? "1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet"
      : example2
  );
  return (
    <div className="p-24 flex flex-col gap-4">
      <Card className="p-3 flex justify-between items-end">
        <PartToolbar part={searchParams.part} />
        <Toggle variant="outline" className="w-[200px]">
          {({ isSelected }) => (isSelected ? sum : "Show Answer")}
        </Toggle>
      </Card>
      <div className="flex gap-2 relative">
        <TextField className="w-1/2 h-full" onChange={setValues}>
          <TextArea
            className="min-h-full text-base  text-transparent bg-transparent caret-white"
            value={values}
          />
        </TextField>
        <div
          aria-hidden
          className="text-white w-1/2 z-[-1] absolute flex flex-col rounded-md border border-input px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-full text-base text-transparent bg-transparent caret-white"
        >
          {trebuchet(
            values.split("\n"),
            searchParams.part && searchParams.part === "2"
              ? [...maxSetNo, ...matchSetDigits]
              : [...maxSetNo]
          )}
        </div>
      </div>
    </div>
  );
}
