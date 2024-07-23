import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";

const TextAreaList: React.FC = () => {
  const [textRows, setTextRows] = useState<[string]>([]);
  const [currentRow, setCurrentRow] = useState<number>(1);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  };

  return (
    <div
      className="m-2 rounded-md overflow-scroll h-40 bg-slate-700"
      onKeyDown={handleKeyDown}
    >
      {textRows.map((index, textRow) => (
        <TextAreaInput index={Number(index + 1)} />
      ))}
      <TextAreaInput index={1} />
      {/* <TextAreaInput index={2} />
      <TextAreaInput index={3} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={4} />
      <TextAreaInput index={99} /> */}
    </div>
  );
};

const TextAreaInput: React.FC<{ index: number }> = ({ index }) => {
  const [text, setText] = useState<string>("");
  return (
    <div className="flex w-full bg-slate-700">
      <p className="px-2 min-w-10">{index}.</p>
      <input
        className="w-full bg-transparent outline-none px-2 text-wrap"
        onChange={(e) => setText(e.target.value)}
        type="text"
        value={text}
      />
    </div>
  );
};

export default TextAreaList;
