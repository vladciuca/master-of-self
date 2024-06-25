"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import data from "@emoji-mart/data";
import { init } from "emoji-mart";
import Picker from "@emoji-mart/react";
import { Button } from "@components/ui/button";

init({ data });

const IconPicker = ({ onIconSelect, skillIcon }) => {
  const defaultIcon = skillIcon ? skillIcon : ":heavy_plus_sign:";
  const { theme } = useTheme();
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(defaultIcon);

  const handleIconSelect = (e) => {
    setCurrentIcon(e.shortcodes);
    onIconSelect(e.shortcodes);
    setIsPickerVisible(false);
  };

  return (
    <div className="relative">
      <Button
        type="button"
        variant="ghost"
        className="rounded-full h-14 w-14"
        onClick={() => setIsPickerVisible(!isPickerVisible)}
      >
        <div
          className="flex justify-center items-center"
          style={{
            lineHeight: "1",
          }}
        >
          <em-emoji
            shortcodes={currentIcon}
            size="2.2rem"
            style={{ verticalAlign: "middle" }}
          />
        </div>
      </Button>
      {isPickerVisible && (
        <div className={`picker-${theme} absolute`}>
          <Picker
            data={data}
            onEmojiSelect={handleIconSelect}
            onClickOutside={() => setIsPickerVisible(false)}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default IconPicker;
