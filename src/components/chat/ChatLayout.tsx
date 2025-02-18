"use client";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "../Sidebar";
import { cn } from "@/lib/utils";
import MessageContainer from "./MessageContainer";
import { User } from "@/db/dummy";
import { useSelectedUser } from "@/store/useSelectedUser";
import Image from "next/image";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  users: User[];
}

const ChatLayout = ({ defaultLayout = [320, 480], users }: ChatLayoutProps) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { selectedUser } = useSelectedUser();

  useEffect(() => {
    // Check screen width on component mount
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is a common breakpoint for mobile devices
    };

    // Initial check
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full items-stretch bg-background rounded-lg"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={8}
        collapsible={true}
        minSize={isMobile ? 0 : 24}
        maxSize={isMobile ? 8 : 30}
        onCollapse={() => {
          setIsCollapsed(true);
          document.cookie = `react-resizable-panels:collapsed=true;`;
        }}
        onExpand={() => {
          setIsCollapsed(false);
          document.cookie = `react-resizable-panels:collapsed=false;`;
        }}
        className={cn(
          isCollapsed && "min-w-[80px] transition-all duration-200 ease-in-out"
        )}
      >
        <Sidebar isCollapsed={isCollapsed} users={users} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={60}>
        {selectedUser ? (
          <MessageContainer />
        ) : (
          <div className="flex flex-col justify-center items-center gap-4 h-full">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-full md:w-2/3 lg:w-1/2"
            />
            <p className="text-muted-foreground text-center">
              Click on a chat to view the messages
            </p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ChatLayout;
