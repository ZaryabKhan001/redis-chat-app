"use client";
import React from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import useSound from "use-sound";

const PreferencesTab = () => {
  const { setTheme } = useTheme();
  const { soundEnabled, setSoundEnabled } = usePreferencesStore();
  const [playMouseClick] = useSound("/sounds/public_sounds_mouse-click.mp3", {
    volume: 0.3,
  });
  const [playSoundOn] = useSound("/sounds/public_sounds_sound-on.mp3", {
    volume: 0.3,
  });
  const [playSoundOff] = useSound("/sounds/public_sounds_sound-off.mp3", {
    volume: 0.3,
  });

  return (
    <div className="flex lfex-wrap gap-2 px-1 md:px-2">
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          setTheme("light");
          if (soundEnabled) {
            playMouseClick();
          }
        }}
      >
        <SunIcon className="size-[1.2rem] text-muted-foreground" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          setTheme("dark");
          if (soundEnabled) {
            playMouseClick();
          }
        }}
      >
        <MoonIcon className="size-[1.2rem] text-muted-foreground" />
      </Button>
      <Button
        variant={"outline"}
        size={"icon"}
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          if (soundEnabled) {
            playSoundOff();
          } else {
            playSoundOn();
          }
        }}
      >
        {soundEnabled === true ? (
          <Volume2 className="size-[1.2rem] text-muted-foreground" />
        ) : (
          <VolumeX className="size-[1.2rem] text-muted-foreground" />
        )}
      </Button>
    </div>
  );
};

export default PreferencesTab;
