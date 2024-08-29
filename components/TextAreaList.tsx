import React, { useState, useRef, useEffect, useCallback } from "react";

interface TextAreaListProps {
  entries: string[];
  onChange: (newEntries: string[], score: number) => void;
}

const TextAreaList = React.memo(({ entries, onChange }: TextAreaListProps) => {
  const [textRows, setTextRows] = useState<string[]>(() => {
    return Array.isArray(entries) && entries.length > 0 ? entries : [""];
  });
  const [focusedRow, setFocusedRow] = useState<number>(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const calculateScore = useCallback((entries: string[]) => {
    const totalEntries = entries.length;
    const totalLength = entries.join("").length;
    return Math.floor((totalEntries * 5 + totalLength) / 10);
  }, []);

  useEffect(() => {
    const filteredEntries = textRows.filter((row) => row.trim() !== "");
    const score = calculateScore(filteredEntries);

    // Only call onChange if the entries have actually changed
    if (JSON.stringify(filteredEntries) !== JSON.stringify(entries)) {
      onChange(filteredEntries, score);
    }
  }, [textRows, onChange, calculateScore, entries]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, textRows.length);
  }, [textRows]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
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

  const refCallback = useCallback(
    (index: number, text: string) => (el: HTMLLIElement | null) => {
      itemRefs.current[index] = el;
      if (el && el.textContent !== text) {
        el.textContent = text;
      }
    },
    []
  );

  const handleInputCurried = useCallback(
    (index: number) => (event: React.FormEvent<HTMLLIElement>) => {
      const newText = event.currentTarget.textContent || "";
      setTextRows((prev) => {
        const newRows = [...prev];
        newRows[index] = newText;
        return newRows;
      });
    },
    []
  );

  const handleFocusCurried = useCallback(
    (index: number) => () => {
      setFocusedRow(index);
    },
    []
  );

  const focusOnTouch = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click occurred directly on the div, not on its children
    if (event.target !== event.currentTarget) return;

    const lastIndex = textRows.length - 1;
    const lastItemRef = itemRefs.current[lastIndex];

    if (!lastItemRef) return;

    lastItemRef.focus();

    // Move cursor to the end of the content
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(lastItemRef);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  return (
    <div
      className="m-2 mb-12 rounded-md overflow-scroll min-h-60 list-decimal"
      onClick={focusOnTouch}
    >
      <ol
        className="list-decimal ml-8 mr-3 py-2  "
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {textRows.map((text, index) => (
          <li
            key={`row-${index}`}
            ref={refCallback(index, text)}
            className="outline-none my-2"
            contentEditable
            suppressContentEditableWarning={true}
            onInput={handleInputCurried(index)}
            onFocus={handleFocusCurried(index)}
          />
        ))}
      </ol>
    </div>
  );
});

export default TextAreaList;
