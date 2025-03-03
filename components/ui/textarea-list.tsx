// import React, { useState, useRef, useEffect, useCallback } from "react";

// interface TextAreaListProps {
//   entryList: string[];
//   onChange: (newEntries: string[]) => void;
// }

// function TextAreaList({ entryList, onChange }: TextAreaListProps) {
//   const [textRows, setTextRows] = useState<string[]>(() => {
//     return Array.isArray(entryList) && entryList.length > 0 ? entryList : [""];
//   });
//   const [focusedRow, setFocusedRow] = useState<number>(-1); //no row is focused initially
//   const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

//   useEffect(() => {
//     const filteredEntries = textRows.filter((row) => row.trim() !== "");
//     if (JSON.stringify(filteredEntries) !== JSON.stringify(entryList)) {
//       onChange(filteredEntries);
//     }
//   }, [textRows, onChange, entryList]);

//   useEffect(() => {
//     itemRefs.current = itemRefs.current.slice(0, textRows.length);
//   }, [textRows]);

//   // focus the last row on initial render
//   useEffect(() => {
//     setFocusedRow(textRows.length - 1);
//   }, []);

//   // Handle focusing and selection
//   useEffect(() => {
//     if (focusedRow >= 0 && focusedRow < itemRefs.current.length) {
//       const element = itemRefs.current[focusedRow];
//       if (element) {
//         element.focus();
//         // Set selection to the end of the content
//         const range = document.createRange();
//         range.selectNodeContents(element);
//         range.collapse(false);
//         const selection = window.getSelection();
//         selection?.removeAllRanges();
//         selection?.addRange(range);
//       }
//     }
//   }, [focusedRow, textRows.length]);

//   const handleKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
//     if (event.key === "Enter") {
//       event.preventDefault();
//       const newIndex = focusedRow + 1;
//       setTextRows((prev) => [
//         ...prev.slice(0, newIndex),
//         "",
//         ...prev.slice(newIndex),
//       ]);
//       setFocusedRow(newIndex);
//     }
//     if (event.key === "Backspace") {
//       const currentLi = itemRefs.current[focusedRow];
//       if (currentLi?.textContent === "" && textRows.length > 1) {
//         event.preventDefault();
//         const newIndex = Math.max(0, focusedRow - 1);
//         setTextRows((prev) => prev.filter((_, index) => index !== focusedRow));
//         setFocusedRow(newIndex);
//       }
//     }
//   };

//   const refCallback = useCallback(
//     (index: number, text: string) => (el: HTMLLIElement | null) => {
//       itemRefs.current[index] = el;
//       if (el && el.textContent !== text) {
//         el.textContent = text;
//       }
//     },
//     []
//   );

//   const handleInputCurried = useCallback(
//     (index: number) => (event: React.FormEvent<HTMLLIElement>) => {
//       const newText = event.currentTarget.textContent || "";
//       setTextRows((prev) => {
//         const newRows = [...prev];
//         newRows[index] = newText;
//         return newRows;
//       });
//     },
//     []
//   );

//   const handleFocusCurried = useCallback(
//     (index: number) => () => {
//       setFocusedRow(index);
//     },
//     []
//   );

//   const focusOnTouch = (event: React.MouseEvent<HTMLDivElement>) => {
//     // Check if the click occurred directly on the div, not on its children
//     if (event.target !== event.currentTarget) return;

//     const lastIndex = textRows.length - 1;
//     const lastItemRef = itemRefs.current[lastIndex];

//     if (!lastItemRef) return;

//     lastItemRef.focus();

//     // Move cursor to the end of the content
//     const range = document.createRange();
//     const selection = window.getSelection();
//     range.selectNodeContents(lastItemRef);
//     range.collapse(false);
//     selection?.removeAllRanges();
//     selection?.addRange(range);
//   };

//   return (
//     <div
//       className="rounded-md overflow-scroll h-full min-h-60"
//       onClick={focusOnTouch}
//     >
//       <ol
//         className="list-decimal ml-8 mr-3 py-2  "
//         onClick={(e) => e.stopPropagation()}
//         onKeyDown={handleKeyDown}
//       >
//         {textRows.map((text, index) => (
//           <li
//             key={`row-${index}`}
//             ref={refCallback(index, text)}
//             className="outline-none text-base"
//             contentEditable
//             suppressContentEditableWarning={true}
//             onInput={handleInputCurried(index)}
//             onFocus={handleFocusCurried(index)}
//           />
//         ))}
//       </ol>
//     </div>
//   );
// }

// TextAreaList.displayName = "TextAreaList";

// const MemoizedTextAreaList = React.memo(
//   TextAreaList,
//   (prevProps, nextProps) => {
//     return (
//       JSON.stringify(prevProps.entryList) ===
//         JSON.stringify(nextProps.entryList) &&
//       prevProps.onChange === nextProps.onChange
//     );
//   }
// );

// export { MemoizedTextAreaList as TextAreaList };

// ===========================================================================================

// NOTE: This custom component syncs its state with the parent form
// ### ADDED: text splitting on cursor position on Enter
// ### ADDED: be able to delete via Backspace a fieldRow if there is text inside
// the text should be moved at the end of previous fieldRow
"use client";

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
  // ref to store the index where we want to place the cursor
  const cursorTargetRef = useRef<{ row: number; offset: number } | null>(null);

  useEffect(() => {
    const filteredEntries = textRows.filter((row) => row.trim() !== "");
    if (JSON.stringify(filteredEntries) !== JSON.stringify(entryList)) {
      onChange(filteredEntries);
    }
  }, [textRows, onChange, entryList]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, textRows.length);
  }, [textRows]);

  useEffect(() => {
    setFocusedRow(textRows.length - 1);
  }, []);

  // handles both initial focus and cursor positioning after splitting
  useEffect(() => {
    if (focusedRow >= 0 && focusedRow < itemRefs.current.length) {
      const element = itemRefs.current[focusedRow];
      if (element) {
        element.focus();

        // Check if we have a specific cursor target
        if (
          cursorTargetRef.current &&
          cursorTargetRef.current.row === focusedRow
        ) {
          const range = document.createRange();
          const textNode = element.firstChild || element;
          range.setStart(textNode, cursorTargetRef.current.offset);
          range.collapse(true);

          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);

          // Reset the cursor target
          cursorTargetRef.current = null;
        } else {
          // Default behavior: move cursor to the end
          const range = document.createRange();
          range.selectNodeContents(element);
          range.collapse(false);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    }
  }, [focusedRow]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLOListElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      const currentLi = itemRefs.current[focusedRow];

      if (currentLi) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const fullText = currentLi.textContent || "";

          // Get the text node where the cursor is
          const textNode = range.startContainer;

          // Check if the cursor is at the end of the text
          const isAtEnd =
            (textNode === currentLi || textNode === currentLi.lastChild) &&
            range.startOffset === textNode.textContent!.length;

          if (isAtEnd) {
            // If cursor is at the end, create a new empty row
            setTextRows((prev) => {
              const newRows = [...prev];
              const newIndex = focusedRow + 1;
              return [
                ...newRows.slice(0, newIndex),
                "",
                ...newRows.slice(newIndex),
              ];
            });
          } else {
            // If cursor is not at the end, split the text
            const cursorOffset = getCursorOffset(currentLi, range);
            const textBefore = fullText.substring(0, cursorOffset);
            const textAfter = fullText.substring(cursorOffset);

            setTextRows((prev) => {
              const newRows = [...prev];
              newRows[focusedRow] = textBefore;

              const newIndex = focusedRow + 1;
              return [
                ...newRows.slice(0, newIndex),
                textAfter,
                ...newRows.slice(newIndex),
              ];
            });
          }

          // Set the cursor target for the new row
          cursorTargetRef.current = { row: focusedRow + 1, offset: 0 };
          setFocusedRow(focusedRow + 1);
        }
      }
    }

    if (event.key === "Backspace") {
      const currentLi = itemRefs.current[focusedRow];

      // Check if we're at the start of a line that's not the first line
      if (currentLi && focusedRow > 0) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const cursorOffset = getCursorOffset(currentLi, range);

          // If cursor is at the beginning of line
          if (cursorOffset === 0) {
            event.preventDefault();

            // Get content of current line
            const currentText = currentLi.textContent || "";

            // Get previous line
            const prevLi = itemRefs.current[focusedRow - 1];
            const prevText = prevLi?.textContent || "";

            // Set cursor position at the junction of both texts
            const newCursorPosition = prevText.length;

            // Update text rows
            setTextRows((prev) => {
              const newRows = [...prev];
              newRows[focusedRow - 1] = prevText + currentText;
              return newRows.filter((_, index) => index !== focusedRow);
            });

            // Set focus to previous row with cursor at the junction
            cursorTargetRef.current = {
              row: focusedRow - 1,
              offset: newCursorPosition,
            };
            setFocusedRow(focusedRow - 1);
          }
        }
      }
      // Keep the existing logic for empty lines
      else if (currentLi?.textContent === "" && textRows.length > 1) {
        event.preventDefault();
        const newIndex = Math.max(0, focusedRow - 1);
        setTextRows((prev) => prev.filter((_, index) => index !== focusedRow));
        setFocusedRow(newIndex);
      }
    }
  };

  // Helper function to get the actual cursor offset
  const getCursorOffset = (element: HTMLElement, range: Range): number => {
    const treeWalker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      null
    );
    let charCount = 0;
    let node;

    while ((node = treeWalker.nextNode())) {
      if (node === range.startContainer) {
        return charCount + range.startOffset;
      }
      charCount += node.textContent!.length;
    }

    return charCount;
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
    if (event.target !== event.currentTarget) return;

    const lastIndex = textRows.length - 1;
    const lastItemRef = itemRefs.current[lastIndex];

    if (!lastItemRef) return;

    lastItemRef.focus();

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
        className="list-decimal ml-8 mr-3 py-2"
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
