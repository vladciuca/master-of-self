import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
} from "react";

const TextAreaList: React.FC = () => {
  const [textRows, setTextRows] = useState<string[]>([""]);
  const [focusedRow, setFocusedRow] = useState<number>(0);

  console.log(textRows);
  console.log(focusedRow);

  const handleKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setTextRows([...textRows, ""]);
      console.log("ENTER");
    }
    if (event.key === "Backspace") {
      if (textRows[focusedRow] === "" && textRows.length > 1) {
        event.preventDefault();
        const newTextRows: string[] = textRows;
        newTextRows.splice(focusedRow, 1);
        setTextRows(newTextRows);
      }
      console.log("BACKSPACE");
    }
  };

  const handleInput = (event: any, index: any) => {
    const newTextRows: string[] = textRows;
    newTextRows[index] = event.target.innerText;
    setTextRows(newTextRows);
    console.log(textRows);
  };

  return (
    <div className="m-2 rounded-md overflow-scroll h-40 bg-slate-700 list-decimal">
      <ol className="list-decimal ml-8 mr-3 py-2" onKeyDown={handleKeyDown}>
        {textRows.map((listItem: any, index: any) => {
          return (
            <li
              key={index}
              className="outline-none"
              contentEditable
              suppressContentEditableWarning={true}
              onInput={(event) => handleInput(event, index)}
              onFocus={() => setFocusedRow(index)}
            >
              {textRows[index]}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TextAreaList;
