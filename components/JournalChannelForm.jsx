"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FaBoltLightning } from "react-icons/fa6";

const JournalChannelForm = ({ gratefulItems, addGratefulItem }) => {
  const [value, setValue] = useState("");

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleAddItem = () => {
    if (value === "") return;
    console.log("===", value);

    addGratefulItem(value);
    setValue("");
  };
  return (
    <>
      <div className="grid grid-rows-[1fr,auto] h-full">
        <ol className="list-decimal overflow-y-auto w-full px-8">
          {gratefulItems?.map((item, index) => (
            <li key={index} className="mb-3">
              <div className="overflow-x-hidden text-ellipsis">{item}</div>
            </li>
          ))}
        </ol>
        <div className="flex justify-between items-center py-2">
          <Input
            type="text"
            value={value}
            placeholder="What are you feeling grateful for?"
            onChange={handleOnChange}
            className="ml-2"
          />
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={value === ""}
            className="mx-2"
          >
            <span className="mr-1 font-bold">+1</span>
            <FaBoltLightning />
          </Button>
        </div>
      </div>
    </>
  );
};

export default JournalChannelForm;
