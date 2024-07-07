import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";

const TextAreaList: React.FC = () => {
  const [text, setText] = useState<string>("1. ");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.setSelectionRange(text.length, text.length);
    }
  }, [text]);

  const updateNumbering = (value: string): string => {
    const lines = value.split("\n");
    return lines
      .map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine === "" || trimmedLine === `${index + 1}.`) {
          return "";
        }
        const lineContent = line.replace(/^\d+\.\s*/, "");
        return `${index + 1}. ${lineContent}`;
      })
      .filter((line) => line !== "")
      .join("\n");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const lines = text.split("\n");
      const currentLineNumber = lines.length;
      const newLine = `${currentLineNumber + 1}. `;
      setText(text + "\n" + newLine);
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
      rows={10}
      cols={50}
      style={{ whiteSpace: "pre-wrap" }}
    />
  );
};

export default TextAreaList;
