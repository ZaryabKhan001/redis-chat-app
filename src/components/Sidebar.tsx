import { User, USERS } from "@/db/dummy";
import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

import useSound from "use-sound";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useSelectedUser } from "@/store/useSelectedUser";

interface SideBarProps {
  isCollapsed: boolean;
  users: User[];
}

const Sidebar = ({ isCollapsed, users }: SideBarProps) => {
  const selectedUser = USERS[0];
  const { soundEnabled } = usePreferencesStore();
  const { getUser } = useKindeBrowserClient();
  const currentUser = getUser();

  const [playClickSound] = useSound("/sounds/public_sounds_mouse-click.mp3");
  const { setSelectedUser } = useSelectedUser();

  return (
    <div className="group relative flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 max-h-full overflow-auto bg-background">
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
          </div>
        </div>
      )}

      <ScrollArea className="gap-2 px-2 group-[[data-collapsed-true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {users?.map((user, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => {
                      soundEnabled && playClickSound();
                      setSelectedUser(user);
                    }}
                  >
                    <Avatar className="my-1 flex justify-center items-center">
                      <AvatarImage
                        src={user?.image || "/user-placeholder.png"}
                        alt={user.name}
                        width={6}
                        height={6}
                        className="border-2 border-white rounded-full h-10 w-10"
                      />
                      <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">{user.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {user.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button
              onClick={() => {
                soundEnabled && playClickSound();
                setSelectedUser(user);
              }}
              key={index}
              variant={"grey"}
              size="xl"
              className={cn(
                "w-full justify-start gap-4 my-1",
                selectedUser.email === user.email &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink"
              )}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={user?.image || "/user-placeholder.png"}
                  alt={"User image"}
                  className="w-10 h-10"
                />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{user.name}</span>
              </div>
            </Button>
          )
        )}
      </ScrollArea>

      <div className="mt-auto">
        <div className="flex justify-between items-center gap-2 md:px-6 py-2">
          {!isCollapsed && (
            <div className="hidden md:flex gap-2 items-center">
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={currentUser?.picture || "/user-placeholder.png"}
                  alt="avatar"
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 border-2 border-white rounded-full"
                />
              </Avatar>
              <p className="font-bold">
                {currentUser?.given_name} {currentUser?.family_name}
              </p>
            </div>
          )}
          <div className="flex flex-col">
            <LogoutLink>
              <LogOut size={22} className="cursor-pointer" />
            </LogoutLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
