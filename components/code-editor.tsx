"use client";

import Editor, { loader, type EditorProps } from "@monaco-editor/react";
import { useMemo } from "react";

const ADMIN_HOST = "admin.typehero.dev";

const DEFAULT_OPTIONS = {
  fixedOverflowWidgets: true,
  lineNumbers: "on",
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  fontSize: 16,
} as const satisfies EditorProps["options"];

export type CodeEditorProps = Omit<EditorProps, "theme">;

export function CodeEditor({
  onChange,
  onMount,
  options,
  value,
  ...props
}: CodeEditorProps) {
  const editorTheme = "vs-dark";
  const editorOptions = useMemo(() => {
    return {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }, [options]);

  return (
    <Editor
      {...props}
      defaultLanguage="text"
      onChange={onChange}
      onMount={onMount}
      options={editorOptions}
      theme={editorTheme}
      value={value}
    />
  );
}
