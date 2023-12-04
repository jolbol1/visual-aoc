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
  "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
  "Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
  "Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
  "Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
  "Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];

const indexRegexp = /(?<=\s)[0-9]+(?=:)/g;
const rRegex = /[0-9]+\sred/g;
const gRegex = /[0-9]+\sgreen/g;
const bRegex = /[0-9]+\sblue/g;

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

function findSubstringIndexes(str: string, substring: string) {
  let indexes = [];
  let index = 0;

  while ((index = str.indexOf(substring, index)) !== -1) {
    indexes.push(index);
    index += substring.length; // Move past the current occurrence
  }

  return indexes;
}

const part1 = (data: string[]): PartData => {
  let sum = 0;
  let x = data.map((current, index) => {
    const indexMatch = current.match(indexRegexp);
    let fails = [];
    let redIndexes: { start: number; end: number }[] = [];
    let greenIndexes: { start: number; end: number }[] = [];
    let blueIndexes: { start: number; end: number }[] = [];
    if (indexMatch) {
      const redFails =
        current
          .match(rRegex)
          ?.filter((match) => parseInt(match.split(" ")[0]) > 12) ?? [];
      const greenFails =
        current
          .match(gRegex)
          ?.filter((match) => parseInt(match.split(" ")[0]) > 13) ?? [];
      const blueFails =
        current
          .match(bRegex)
          ?.filter((match) => parseInt(match.split(" ")[0]) > 14) ?? [];
      fails = [...redFails, ...blueFails, ...greenFails];
      redIndexes = Array.from(new Set(redFails))
        ?.map((match) =>
          findSubstringIndexes(current, match).map((matchIdx) => ({
            start: matchIdx,
            end: matchIdx + match.length,
          }))
        )
        .flat();
      greenIndexes = Array.from(new Set(greenFails))
        ?.map((match) =>
          findSubstringIndexes(current, match).map((matchIdx) => ({
            start: matchIdx,
            end: matchIdx + match.length,
          }))
        )
        .flat();
      blueIndexes = Array.from(new Set(blueFails))
        ?.map((match) =>
          findSubstringIndexes(current, match).map((matchIdx) => ({
            start: matchIdx,
            end: matchIdx + match.length,
          }))
        )
        .flat();
      if (fails.length === 0) sum += parseInt(indexMatch[0]);
    }

    return {
      fail: fails.length > 0,
      redIndexes,
      greenIndexes,
      blueIndexes,
    };
  });
  return { data: x, sum };
};

const part2 = (data: string[]): PartData => {
  let sum = 0;
  let x = data.map((current, index) => {
    const indexMatch = current.match(indexRegexp);
    let fails = [];
    let redMin = 0;
    let greenMin = 0;
    let blueMin = 0;
    let redIndexes: { start: number; end: number }[] = [];
    let greenIndexes: { start: number; end: number }[] = [];
    let blueIndexes: { start: number; end: number }[] = [];
    if (indexMatch) {
      redMin = Math.max(
        ...(current
          .match(rRegex)
          ?.map((match) => parseInt(match.split(" ")[0])) ?? [])
      );
      redIndexes = findSubstringIndexes(current, `${redMin} red`).map(
        (matchIdx) => ({
          start: matchIdx,
          end: matchIdx + `${redMin} red`.length,
        })
      );
      greenMin = Math.max(
        ...(current
          .match(gRegex)
          ?.map((match) => parseInt(match.split(" ")[0])) ?? [])
      );
      greenIndexes = findSubstringIndexes(current, `${greenMin} green`).map(
        (matchIdx) => ({
          start: matchIdx,
          end: matchIdx + `${greenMin} green`.length,
        })
      );
      blueMin = Math.max(
        ...(current
          .match(bRegex)
          ?.map((match) => parseInt(match.split(" ")[0])) ?? [])
      );
      blueIndexes = findSubstringIndexes(current, `${blueMin} blue`).map(
        (matchIdx) => ({
          start: matchIdx,
          end: matchIdx + `${blueMin} blue`.length,
        })
      );
      sum += redMin * greenMin * blueMin;
    }

    return {
      fail: fails.length > 0,
      gameNo: indexMatch,
      redMin,
      greenMin,
      blueMin,
      redIndexes,
      greenIndexes,
      blueIndexes,
    };
  });
  return { data: x, sum };
};

type DayOneProps = {
  searchParams: { part: "1" | "2" };
};

const example2 =
  "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen";

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
    setSum(part1res.sum);
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = part1res.data
      .map<monaco.editor.IModelDeltaDecoration[]>((match, index) =>
        [
          ...match.redIndexes.map((res) => ({
            range: new monaco.Range(
              index + 1,
              res.start + 1,
              index + 1,
              res.end + 1
            ),
            options: {
              className: "bg-red-500 text-black",
              inlineClassName: "black",
            },
          })),
          ...match.greenIndexes.map((res) => ({
            range: new monaco.Range(
              index + 1,
              res.start + 1,
              index + 1,
              res.end + 1
            ),
            options: {
              className: "bg-green-500 text-black",
              inlineClassName: "black",
            },
          })),
          ...match.blueIndexes.map((res) => ({
            range: new monaco.Range(
              index + 1,
              res.start + 1,
              index + 1,
              res.end + 1
            ),
            options: {
              className: "bg-blue-500 text-black",
              inlineClassName: "black",
            },
          })),
          {
            range: new monaco.Range(index + 1, 0, index + 1, 1),
            options: {
              isWholeLine: true,
              hoverMessage: {
                supportHtml: true,
                value:
                  searchParams.part === "2"
                    ? `**Fewest number of cubes** </br> Red: ${
                        match.redMin
                      } </br> Green: ${match.greenMin}</br> Red: ${
                        match.blueMin
                      } </br> ${"🟥".repeat(
                        match.redMin ?? 0
                      )}  </br> ${"🟩".repeat(
                        match.greenMin ?? 0
                      )}  </br> ${"🟦".repeat(match.blueMin ?? 0)}`
                    : `**${match.fail ? "Not Possible" : "Possible"}**`,
              },
            },
          },
        ].flat()
      )
      .flat();

    setCurrentDecorations(newDecorations);
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
        <h1 className="font-display text-4xl">Day 2: Cube Conundrum</h1>
        <p className="text-muted-foreground">
          An elf bothers you while you walk
        </p>
        <Link
          className="aoc font-mono w-fit"
          href="https://adventofcode.com/2023/day/2"
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
