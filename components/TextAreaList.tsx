import React, { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";

const TextAreaList: React.FC = () => {
  const [textRows, setTextRows] = useState<string[]>([""]);
  const [focusedRow, setFocusedRow] = useState<number>(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, textRows.length);
  }, [textRows]);

  const handleKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newIndex = focusedRow + 1;
      setTextRows((prev) => [
        ...prev.slice(0, newIndex),
        "",
        ...prev.slice(newIndex),
      ]);
      setFocusedRow(newIndex);

      setTimeout(() => {
        itemRefs.current[newIndex]?.focus();
      }, 0);
    }
    if (event.key === "Backspace") {
      const currentLi = itemRefs.current[focusedRow];
      if (currentLi?.textContent === "" && textRows.length > 1) {
        event.preventDefault();
        const newIndex = Math.max(0, focusedRow - 1);
        setTextRows((prev) => prev.filter((_, index) => index !== focusedRow));
        setFocusedRow(newIndex);

        setTimeout(() => {
          const prevLi = itemRefs.current[newIndex];
          if (prevLi) {
            prevLi.focus();
            const range = document.createRange();
            range.selectNodeContents(prevLi);
            range.collapse(false);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 0);
      }
    }
  };

  const refCallback = useCallback((index: number, text: string) => (el: HTMLLIElement | null) => {
    itemRefs.current[index] = el;
    if (el && el.textContent !== text) {
      el.textContent = text;
    }
  }, []);

  const handleInputCurried = useCallback((index: number) => (event: React.FormEvent<HTMLLIElement>) => {
    const newText = event.currentTarget.textContent || "";
    setTextRows((prev) => {
      const newRows = [...prev];
      newRows[index] = newText;
      return newRows;
    });
  }, []);

  const handleFocusCurried = useCallback((index: number) => () => {
    setFocusedRow(index);
  }, []);

  return (
    <div className="m-2 rounded-md overflow-scroll h-40 bg-slate-700 list-decimal">
      <ol className="list-decimal ml-8 mr-3 py-2" onKeyDown={handleKeyDown}>
        {textRows.map((text, index) => (
          <li
          key={`row-${index}`}
          ref={refCallback(index, text)}
          className="outline-none"
          contentEditable
          suppressContentEditableWarning={true}
          onInput={handleInputCurried(index)}
          onFocus={handleFocusCurried(index)}
          />
        ))}
      </ol>
    </div>
  );
};

export default TextAreaList;