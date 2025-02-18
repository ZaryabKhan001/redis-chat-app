"use client";
import React from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SmileIcon } from "lucide-react";
import { useTheme } from "next-themes";

interface EmojiPickerComponentProps {
  setMessage: (callback: (message: string) => string) => void;
}

const EmojiPickerComponent = ({ setMessage }: EmojiPickerComponentProps) => {
  const { theme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger>
        <SmileIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition" />
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <EmojiPicker
          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={(emoji) => {
            setMessage((message: string) => message + emoji.emoji);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerComponent;
