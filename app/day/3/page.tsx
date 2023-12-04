"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { CodeEditor, CodeEditorProps } from "@/components/code-editor";
import { Monaco } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { PartToolbar } from "@/components/part-toolbar";
import { Toggle } from "@/components/ui/toggle";
import { Link } from "react-aria-components";

const seedInput = [
  "467..114..",
  "...*......",
  "..35..633.",
  "......#...",
  "617*......",
  ".....+.58.",
  "..592.....",
  "......755.",
  "...$.*....",
  ".664.598..",
];

const symbolRegx = /[^0-9a-zA-Z.\n\r]/g;

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

type FailRange = {
  startIndex: number;
  endIndex: number;
  color: string;
  hoverText: string;
};

type PartData = {
  sum: number;
  data: Day2Data[];
};

type Day2Data = {
  redIndexes: { start: number; end: number }[];
  greenIndexes: { start: number; end: number }[];
  blueIndexes: { start: number; end: number }[];
  fail?: boolean;
  blueMin?: number;
  redMin?: number;
  greenMin?: number;
};

const part1 = (data: string[]) => {
  type SymbolCoords = [number, number][];
  const symbolCoords: SymbolCoords = [];
  const grid = data.map((line) => line.split(""));
  const symbols = grid.forEach((line, lineIdx) => {
    line.forEach((col, colIdx) => {
      if (col.match(symbolRegx)) {
        symbolCoords.push([lineIdx, colIdx]);
      }
    });
  });

  const adjacentCoords: number[][] = [];
  symbolCoords.forEach((coord) => {
    directions.forEach((dir) => {
      const checkSymbolCoord = [coord[0] + dir[0], coord[1] + dir[1]];
      // Make sure coord can exist (isnt negative)
      if (!checkSymbolCoord.some((val) => val < 0)) {
        const check = grid[checkSymbolCoord[0]][checkSymbolCoord[1]];
        if (check?.match(/[0-9]/)) {
          adjacentCoords.push(checkSymbolCoord);
        }
      }
    });
  });

  const partNumbers: string[] = [];
  const numberCoords: { line: number; start: number; end: number }[] = [];
  const checkedCoords: number[][] = [];
  adjacentCoords.forEach((coord) => {
    let beforeCol = coord[1] - 1;
    let afterCol = coord[1] + 1;
    if (
      checkedCoords.find(
        (coords) => coords[0] === coord[0] && coords[1] === coord[1]
      )
    ) {
      return;
    }
    let number = grid[coord[0]][coord[1]];
    console.log(number, checkedCoords, coord, checkedCoords.includes(coord));
    checkedCoords.push(coord);

    while (beforeCol >= 0) {
      if (grid[coord[0]][beforeCol]?.match(/[0-9]/)) {
        number = `${grid[coord[0]][beforeCol]}${number}`;
        checkedCoords.push([coord[0], beforeCol]);
      } else {
        break;
      }

      beforeCol = beforeCol - 1;
    }

    let test = true;
    while (test) {
      if (grid[coord[0]][afterCol]?.match(/[0-9]/)) {
        number = `${number}${grid[coord[0]][afterCol]}`;
        checkedCoords.push([coord[0], afterCol]);
      } else {
        test = false;
        break;
      }

      afterCol = afterCol + 1;
    }

    partNumbers.push(number);
    numberCoords.push({
      line: coord[0],
      start: beforeCol + 1,
      end: afterCol,
    });
  });

  var sum = partNumbers.reduce((accumulator, currentValue) => {
    return accumulator + parseInt(currentValue);
  }, 0);

  console.log({
    symbolCoords,
    adjacentCoords,
    partNumbers,
    checkedCoords,
    sum,
    numberCoords,
  });

  return {
    symbolCoords,
    adjacentCoords,
    partNumbers,
    checkedCoords,
    sum,
    numberCoords,
  };
};

const part2 = (data: string[]) => {
  return null;
};

type DayOneProps = {
  searchParams: { part: "1" | "2" };
};
// If you have made it here, Im sorry for the mess. I do not have time to optimise the challenges once theyre done, I take my first success and run with it
export default function MyEditor({ searchParams }: DayOneProps) {
  const [editorState, setEditorState] =
    useState<monaco.editor.IStandaloneCodeEditor>();
  const [monacoState, setMonacoState] = useState<Monaco>();
  const [currentDecorations, setCurrentDecorations] = useState<
    monaco.editor.IModelDeltaDecoration[]
  >([]);
  const decorationsCollectionRef =
    useRef<monaco.editor.IEditorDecorationsCollection>();
  const [sum, setSum] = useState(0);

  const highlightWord = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    const model = editor?.getModel();
    const input = model?.getValue() ?? "";
    const part1res =
      searchParams.part === "2"
        ? part2(input.split("\n"))
        : part1(input.split("\n"));

    setSum(part1res?.sum ?? 0);

    const newDecorations: monaco.editor.IModelDeltaDecoration[] =
      part1res?.numberCoords.map<monaco.editor.IModelDeltaDecoration>(
        (match, index) => ({
          range: new monaco.Range(
            match.line + 1,
            match.start + 1,
            match.line + 1,
            match.end + 1
          ),
          options: {
            className: "bg-red-500 text-black",
            inlineClassName: "black",
          },
        })
      ) ?? [];

    const symbolDecs =
      part1res?.symbolCoords.map<monaco.editor.IModelDeltaDecoration>(
        (match, index) => ({
          range: new monaco.Range(
            match[0] + 1,
            match[1] + 1,
            match[0] + 1,
            match[1] + 2
          ),
          options: {
            className: "bg-blue-500 text-black",
            inlineClassName: "black",
          },
        })
      ) ?? [];

    setCurrentDecorations([...newDecorations, ...symbolDecs]);
  };

  useEffect(() => {
    if (editorState) {
      if (decorationsCollectionRef.current) {
        decorationsCollectionRef.current.clear();
        decorationsCollectionRef.current.set(currentDecorations);
      } else {
        decorationsCollectionRef.current =
          editorState.createDecorationsCollection(currentDecorations);
      }
    }
  }, [currentDecorations, editorState]);

  useEffect(() => {
    // Change the update function
    if (editorState && monacoState) {
      // Rerun to change on click
      highlightWord(editorState, monacoState);
      editorState.onDidChangeModelContent(() => {
        highlightWord(editorState, monacoState);
      });
    }
  }, [editorState, monacoState, searchParams.part]);

  const onMount = useCallback<NonNullable<CodeEditorProps["onMount"]>>(
    async (editor, monaco) => {
      const model = editor.getModel();

      if (!model) {
        throw new Error();
      }

      setEditorState(editor);
      setMonacoState(monaco);
    },
    [searchParams.part]
  );

  return (
    <div
      className="flex flex-col gap-4 pb-6"
      style={{ height: "calc(100vh - 57px)" }}
    >
      <div className="py-6 flex flex-col gap-2">
        <h1 className="font-display text-4xl">Day 3: Gear Ratios</h1>
        <p className="text-muted-foreground">
          There seems to be a problem: they&apos;re not moving!
        </p>
        <Link
          className="aoc font-mono w-fit"
          href="https://adventofcode.com/2023/day/3"
        >
          [Problem Link]
        </Link>
      </div>
      <Card className="h-full overflow-hidden">
        <div className="p-3 flex justify-between items-end border-b-border border-b bg-[#1e1e1e]">
          <PartToolbar part={searchParams.part} />
          <Toggle variant="outline" className="w-[200px] bg-background">
            {({ isSelected }) => (isSelected ? sum : "Show Answer")}
          </Toggle>
        </div>
        <div className="flex gap-2 relative h-[calc(100%-_87px)]">
          <CodeEditor
            defaultValue={seedInput.join("\n")}
            onMount={onMount}
            className="h-full"
          />
        </div>
      </Card>
    </div>
  );
}
