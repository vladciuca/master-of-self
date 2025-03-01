import React, { useState, useRef, useEffect, useCallback } from "react";

interface TextAreaListProps {
  entryList: string[];
  onChange: (newEntries: string[]) => void;
}

function TextAreaList({ entryList, onChange }: TextAreaListProps) {
  const [textRows, setTextRows] = useState<string[]>(() => {
    return Array.isArray(entryList) && entryList.length > 0 ? entryList : [""];
  });
  const [focusedRow, setFocusedRow] = useState<number>(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Update internal state when props change
  // was added to ensure that the internal state of the TextAreaList component (textRows) stays in sync with the external prop (entryList) provided by the parent component. This is important in a controlled component scenario, where the source of truth for the data is in the parent component (managed by React Hook Form in this case).
  // useEffect(() => {
  //   if (JSON.stringify(entryList) !== JSON.stringify(textRows)) {
  //     setTextRows(entryList.length > 0 ? entryList : [""]);
  //   }
  // }, [entryList]);

  useEffect(() => {
    const filteredEntries = textRows.filter((row) => row.trim() !== "");
    if (JSON.stringify(filteredEntries) !== JSON.stringify(entryList)) {
      onChange(filteredEntries);
    }
  }, [textRows, onChange, entryList]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, textRows.length);
  }, [textRows]);

  // Handle focusing and selection
  useEffect(() => {
    if (focusedRow >= 0 && focusedRow < itemRefs.current.length) {
      const element = itemRefs.current[focusedRow];
      if (element) {
        element.focus();
        // Set selection to the end of the content
        const range = document.createRange();
        range.selectNodeContents(element);
        range.collapse(false);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [focusedRow, textRows.length]);

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
    }
    if (event.key === "Backspace") {
      const currentLi = itemRefs.current[focusedRow];
      if (currentLi?.textContent === "" && textRows.length > 1) {
        event.preventDefault();
        const newIndex = Math.max(0, focusedRow - 1);
        setTextRows((prev) => prev.filter((_, index) => index !== focusedRow));
        setFocusedRow(newIndex);
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
      className="rounded-md overflow-scroll h-full min-h-60"
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
            className="outline-none text-base"
            contentEditable
            suppressContentEditableWarning={true}
            onInput={handleInputCurried(index)}
            onFocus={handleFocusCurried(index)}
          />
        ))}
      </ol>
    </div>
  );
}

TextAreaList.displayName = "TextAreaList";

const MemoizedTextAreaList = React.memo(
  TextAreaList,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.entryList) ===
        JSON.stringify(nextProps.entryList) &&
      prevProps.onChange === nextProps.onChange
    );
  }
);

export { MemoizedTextAreaList as TextAreaList };
// "use client";

// import type React from "react";
// import { useRef, useCallback } from "react";

// interface TextAreaListProps {
//   value: string[];
//   onChange: (newValue: string[]) => void;
// }

// export function TextAreaList({ value, onChange }: TextAreaListProps) {
//   const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

//   const handleKeyDown = useCallback(
//     (event: React.KeyboardEvent<HTMLLIElement>, index: number) => {
//       if (event.key === "Enter") {
//         event.preventDefault();
//         const newValue = [...value];
//         newValue.splice(index + 1, 0, "");
//         onChange(newValue);
//         // Focus will be handled by React in the next render
//       } else if (
//         event.key === "Backspace" &&
//         value[index] === "" &&
//         value.length > 1
//       ) {
//         event.preventDefault();
//         const newValue = value.filter((_, i) => i !== index);
//         onChange(newValue);
//         // Focus previous item if available
//         if (index > 0) {
//           itemRefs.current[index - 1]?.focus();
//         }
//       }
//     },
//     [value, onChange]
//   );

//   const handleInput = useCallback(
//     (index: number, newText: string) => {
//       const newValue = [...value];
//       newValue[index] = newText;
//       onChange(newValue);
//     },
//     [value, onChange]
//   );

//   const refCallback = useCallback((el: HTMLLIElement | null, index: number) => {
//     itemRefs.current[index] = el;
//   }, []);

//   return (
//     <div className="rounded-md overflow-scroll h-full min-h-60">
//       <ol className="list-decimal ml-8 mr-3 py-2">
//         {value.map((text, index) => (
//           <li
//             key={index}
//             ref={(el) => refCallback(el, index)}
//             className="outline-none text-base"
//             contentEditable
//             suppressContentEditableWarning
//             onInput={(e) =>
//               handleInput(index, e.currentTarget.textContent || "")
//             }
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             dangerouslySetInnerHTML={{ __html: text }}
//           />
//         ))}
//       </ol>
//     </div>
//   );
// }
