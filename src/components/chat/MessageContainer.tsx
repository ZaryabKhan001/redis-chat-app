import React, { useEffect, useRef } from "react";
import ChatTopbar from "./ChatTopbar";
import MessageList from "./MessageList";
import ChatBottomBar from "./ChatBottomBar";
import { useSelectedUser } from "@/store/useSelectedUser";

const MessageContainer = () => {
  const { setSelectedUser } = useSelectedUser();

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedUser(null);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar />
      <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
        <MessageList />
        <ChatBottomBar />
      </div>
    </div>
  );
};

export default MessageContainer;
