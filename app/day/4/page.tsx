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
  "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53",
  "Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19",
  "Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1",
  "Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83",
  "Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36",
  "Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11",
];

const pointsCounter = (matches: number) => {
  if (matches === 0) return 0;
  let result = 1;
  for (let i = 0; i < matches - 1; i++) {
    result *= 2;
  }
  return result;
};

function findNumberIndices(str: string, numbers: number[]) {
  let results: { start: number; end: number }[] = [];

  numbers.forEach((number) => {
    let searchFromIndex = 0;
    let numberStr = number.toString();
    while (str.indexOf(numberStr, searchFromIndex) !== -1) {
      let start = str.indexOf(numberStr, searchFromIndex);
      let end = start + numberStr.length;
      results.push({ start: start, end: end });
      searchFromIndex = end; // Update the index to search from for the next occurrence
    }
  });

  return results;
}

const part1 = (data: string[]) => {
  const games = data.map((game, idx) => ({
    game: game.match(/(?<=\s)[0-9]+(?=:)/g)?.toString(),
    winningNumbers: game
      .split(":")[1]
      .split("|")[0]
      .trim()
      .split(" ")
      .filter((n) => n !== "")
      .map((n) => parseInt(n.trim())),
    numbers: game
      .split(":")[1]
      .split("|")[1]
      .trim()
      .split(" ")
      .filter((n) => n !== "")
      .map((n) => parseInt(n.trim())),
    line: idx,
  }));

  type Results = {
    game: string | undefined;
    matches: number[];
    points: number;
    line: number;
    copies?: number;
    highlight: {
      start: number;
      end: number;
    }[];
  }[];

  let results: Results = games.map((game) => ({
    game: game.game,
    matches: game.numbers.filter((n) => game.winningNumbers.includes(n)),
    points: 0,
    line: game.line,
    highlight: [],
  }));

  results = results.map((game) => ({
    ...game,
    points: pointsCounter(game.matches.length),
    highlight: findNumberIndices(data[game.line], game.matches),
  }));

  console.log({
    results,
    games,
  });

  return {
    sum: results.reduce((acc, curr) => {
      return acc + curr.points;
    }, 0),
    results,
  };
};

const part2 = (data: string[]) => {
  const games = data.map((game, idx) => ({
    game: game.match(/(?<=\s)[0-9]+(?=:)/g)?.toString(),
    winningNumbers: game
      .split(":")[1]
      .split("|")[0]
      .trim()
      .split(" ")
      .filter((n) => n !== "")
      .map((n) => parseInt(n.trim())),
    numbers: game
      .split(":")[1]
      .split("|")[1]
      .trim()
      .split(" ")
      .filter((n) => n !== "")
      .map((n) => parseInt(n.trim())),
    line: idx,
  }));

  type Results = {
    game: string | undefined;
    copies: number;
    matches: number[];
    line: number;
    points?: number;
    highlight: {
      start: number;
      end: number;
    }[];
  }[];

  let results: Results = games.map((game) => ({
    game: game.game,
    copies: 1,
    matches: game.numbers.filter((n) => game.winningNumbers.includes(n)),
    line: game.line,
    highlight: [],
  }));

  results = results.map((game) => ({
    ...game,
    highlight: findNumberIndices(data[game.line], game.matches),
  }));

  results.forEach((game, index) => {
    const wins = game.matches.length;
    for (let i = 1; i < wins + 1; i++) {
      results[index + i].copies += game.copies;
    }
  });

  // console.log({
  //   results,
  //   games,
  //   sum: results.reduce((acc, curr) => acc + curr.copies, 0),
  // });

  return {
    sum: results.reduce((acc, curr) => acc + curr.copies, 0),
    results,
  };
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

    setSum(part1res?.sum ?? 0);

    const newDecorations: monaco.editor.IModelDeltaDecoration[] =
      part1res?.results
        .map<monaco.editor.IModelDeltaDecoration[]>((result, index) => {
          const highlights =
            result.highlight.map<monaco.editor.IModelDeltaDecoration>(
              (range, idx) => ({
                range: new monaco.Range(
                  result.line + 1,
                  range.start + 1,
                  result.line + 1,
                  range.end + 1
                ),
                options: {
                  className: "bg-lime-500 text-black",
                  inlineClassName: "black",
                },
              })
            );
          const hover = {
            range: new monaco.Range(result.line + 1, 0, result.line + 1, 1),
            options: {
              isWholeLine: true,
              hoverMessage: {
                supportHtml: true,
                value:
                  searchParams.part === "2"
                    ? `**Winning Numbers:** ${result.matches.join(
                        ","
                      )} </br> **Copies:** ${result.copies}`
                    : `**Winning Numbers:** ${result.matches.join(
                        ","
                      )} </br> **Points:** ${result.points}`,
              },
            },
          };

          return [hover, ...highlights];
        })
        .flat() ?? [];

    // const symbolDecs =
    //   part1res?.symbolCoords.map<monaco.editor.IModelDeltaDecoration>(
    //     (match, index) => ({
    //       range: new monaco.Range(
    //         match[0] + 1,
    //         match[1] + 1,
    //         match[0] + 1,
    //         match[1] + 2
    //       ),
    //       options: {
    //         className: "bg-blue-500 text-black",
    //         inlineClassName: "black",
    //       },
    //     })
    //   ) ?? [];

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
        <h1 className="font-display text-4xl">Day 4: Scratchcards</h1>
        <p className="text-muted-foreground">Has the elf won the lottery?</p>
        <Link
          className="aoc font-mono w-fit"
          href="https://adventofcode.com/2023/day/4"
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
