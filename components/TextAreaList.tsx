import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";

const TextAreaList: React.FC = () => {
  const [text, setText] = useState<string>("1. ");
  const [focusedLine, setFocusedLine] = useState<number>(1);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const newText = updateNumbering(text);
    setText(newText);
  }, [text]);

  const handleSelectionChange = () => {
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const lineNumber = textBeforeCursor.split("\n").length;
      setFocusedLine(lineNumber);
    }
  };

  const updateNumbering = (value: string): string => {
    const lines = value.split("\n");
    return lines
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (
          trimmedLine === "" ||
          (trimmedLine === `${index + 1}.` && index === focusedLine - 1)
        ) {
          return "";
        }
        const lineContent = line.replace(/^\d+\.\s*/, "");
        return `${index + 1}. ${lineContent}`;
      })
      .filter((line) => line !== "")
      .join("\n");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const lines = text.split("\n");
    const lastLineNumber = lines.length;
    if (e.key === "Enter") {
      e.preventDefault();
      if (lines[lastLineNumber - 1] == "" && lastLineNumber <= 1) {
        lines[0] = "1. ";
        lines[1] = "2. ";
        const linesToText = lines.join("\n");
        setText(linesToText);
        return;
      }
      lines.splice(focusedLine, 0, `${focusedLine + 1}. `);
      const linesToText = updateNumbering(lines.join("\n"));

      setText(linesToText);
    }
    if (e.key === "Backspace") {
      if (lines[focusedLine - 1] === `${focusedLine}. `) {
        lines.splice(focusedLine - 1, 1);
        const linesToText = updateNumbering(lines.join("\n"));
        setText(linesToText);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = updateNumbering(e.target.value);
    setText(newText);
  };

  return (
    <textarea
      className="relative w-full p-5 outline-none overflow-y-scroll border border-white"
      ref={textAreaRef}
      value={text}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onSelect={handleSelectionChange}
      onKeyUp={handleSelectionChange}
      onClick={handleSelectionChange}
      rows={10}
      cols={50}
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
};

export default TextAreaList;
