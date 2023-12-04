"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { CodeEditor, CodeEditorProps } from "@/components/code-editor";
import { Monaco } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { PartToolbar } from "@/components/part-toolbar";
import { Toggle } from "@/components/ui/toggle";

const seedInput = [
  "1abc2",
  "pqr3stu8vwx",
  "a1b2c3d4e5f",
  "treb7uchet",
  "two1nine",
  "eightwothree",
  "abcone2threexyz",
  "xtwone3four",
  "4nineeightseven2",
  "zoneight234",
  "7pqrstsixteen",
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

const trebuchet = (data: string[], matchArr: string[]) => {
  let sum = 0;
  const x = data.map((current, index) => {
    const matchesFirst = matchArr.map((type) => current.indexOf(type));
    const matchesLast = matchArr.map((type) => current.lastIndexOf(type));

    const firstIndex = matchesFirst.findIndex(
      (x) => x === Math.min(...matchesFirst.filter((x) => x >= 0))
    );
    const lastIndex = matchesLast.findIndex(
      (x) => x === Math.max(...matchesLast.filter((x) => x >= 0))
    );

    const firstNumber = matchArr[firstIndex];
    const lastNumber = matchArr[lastIndex];

    const firstWordIndex = current.indexOf(firstNumber);
    const lastWordIndex = current.lastIndexOf(lastNumber);

    const first =
      firstIndex < 0 ? 0 : firstIndex > 8 ? firstIndex - 8 : firstIndex + 1;
    const last =
      lastIndex < 0 ? 0 : lastIndex > 8 ? lastIndex - 8 : lastIndex + 1;

    const calValue = parseInt(first.toString() + last.toString());
    sum += calValue;

    // Check for overlap
    const overlapStart = Math.max(firstWordIndex, lastWordIndex);
    const overlapEnd = Math.min(
      firstWordIndex + firstNumber?.length,
      lastWordIndex + lastNumber?.length
    );

    return {
      firstWordIndex,
      firstWordEndIndex: firstWordIndex + firstNumber?.length,
      lastWordIndex,
      lastWordIndexEnd: lastWordIndex + lastNumber?.length,
      overlapStart,
      overlapEnd,
      calValue,
      length: current.length,
    };
  });
  return { lines: x, sum };
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
    const test = trebuchet(
      input.split("\n"),
      searchParams.part === "2" ? [...matchSetDigits, ...maxSetNo] : maxSetNo
    );
    setSum(test.sum);
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = test.lines
      .map<monaco.editor.IModelDeltaDecoration[]>((match, index) =>
        match.overlapStart < match.overlapEnd
          ? [
              {
                range: new monaco.Range(
                  index + 1,
                  match.firstWordIndex + 1,
                  index + 1,
                  match.overlapStart + 1
                ),
                options: {
                  className: "bg-yellow-300 text-black",
                  inlineClassName: "black",
                },
              },
              {
                range: new monaco.Range(
                  index + 1,
                  match.overlapEnd + 1,
                  index + 1,
                  match.lastWordIndexEnd + 1
                ),
                options: {
                  className: "bg-red-400 text-black",
                  inlineClassName: "black",
                },
              },
              {
                range: new monaco.Range(
                  index + 1,
                  match.overlapStart + 1,
                  index + 1,
                  match.overlapEnd + 1
                ),
                options: {
                  className: "bg-orange-400 text-black",
                  inlineClassName: "black",
                },
              },
              {
                range: new monaco.Range(
                  index + 1,
                  0,
                  index + 1,
                  match.length + 1
                ),
                options: {
                  isWholeLine: true,
                  hoverMessage: {
                    supportHtml: true,
                    value: `**Calibration Value:** ${
                      match.calValue === 0 ? "N/A" : match.calValue
                    }`,
                  },
                },
              },
            ]
          : [
              {
                range: new monaco.Range(
                  index + 1,
                  match.firstWordIndex + 1,
                  index + 1,
                  match.firstWordEndIndex + 1
                ),
                options: {
                  className: "bg-yellow-300 text-black",
                  inlineClassName: "black",
                },
              },
              {
                range: new monaco.Range(
                  index + 1,
                  match.lastWordIndex + 1,
                  index + 1,
                  match.lastWordIndexEnd + 1
                ),
                options: {
                  className: "bg-red-400 text-black",
                  inlineClassName: "black",
                },
              },
              {
                range: new monaco.Range(
                  index + 1,
                  0,
                  index + 1,
                  match.length + 1
                ),
                options: {
                  isWholeLine: true,
                  hoverMessage: {
                    supportHtml: true,
                    value: `**Calibration Value:** ${
                      match.calValue === 0 ? "N/A" : match.calValue
                    }`,
                  },
                },
              },
            ]
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
        <h1 className="font-display text-4xl">Day 1: Trebuchet?!</h1>
        <p className="text-muted-foreground">
          The Elves are having trouble reading the values on the document
        </p>
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
