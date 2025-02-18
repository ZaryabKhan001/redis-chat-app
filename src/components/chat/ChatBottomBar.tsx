import { AnimatePresence, motion } from "framer-motion";
import {
  Image as ImageIcon,
  Loader,
  SendHorizontal,
  ThumbsUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import EmojiPickerComponent from "./EmojiPickerComponent";
import { Button } from "../ui/button";
import useSound from "use-sound";
import { usePreferencesStore } from "@/store/usePreferencesStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessageAction } from "../../actions/message.actions";
import { useSelectedUser } from "@/store/useSelectedUser";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import Image from "next/image";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { pusherClient } from "@/lib/pusher";
import { Message } from "@/db/dummy";

const ChatBottomBar = () => {
  const [message, setMessage] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [playSound1] = useSound("/sounds/public_sounds_keystroke1.mp3");
  const [playSound2] = useSound("/sounds/public_sounds_keystroke2.mp3");
  const [playSound3] = useSound("/sounds/public_sounds_keystroke3.mp3");
  const [playSound4] = useSound("/sounds/public_sounds_keystroke4.mp3");
  const [playNotificationSound] = useSound(
    "/sounds/public_sounds_notification.mp3"
  );
  const { user: currentUser } = useKindeBrowserClient();
  const { soundEnabled } = usePreferencesStore();
  const queryClient = useQueryClient();

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: sendMessageAction, // When some calls mutate, eventually it will call sendMessageAction
  });

  const { selectedUser } = useSelectedUser();

  const playSoundArray = [playSound1, playSound2, playSound3, playSound4];

  const playRandomSound = () => {
    const randomIndex = Math.floor(Math.random() * playSoundArray.length);
    return playSoundArray[randomIndex];
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    sendMessage({
      content: message,
      messageType: "text",
      receiverId: String(selectedUser?.id),
    });

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage({
        content: message,
        messageType: "text",
        receiverId: String(selectedUser?.id),
      });
      setMessage("");
    }
    if (e.key === "Enter" && e.shiftKey) {
      setMessage(message + "\n");
    }
  };

  useEffect(() => {
    const channelName = `${currentUser?.id}__${selectedUser?.id}`
      .split("__")
      .sort()
      .join("__");
    const channel = pusherClient?.subscribe(channelName);

    const handleNewMessage = (data: { message: Message }): void => {
      queryClient.setQueryData(
        ["messages", selectedUser?.id],
        (oldMessages: Message[]) => {
          return [...oldMessages, data.message];
        }
      );
      if (soundEnabled && currentUser?.id !== data.message.senderId)
        playNotificationSound();
    };

    channel.bind("newMessage", handleNewMessage);

    return () => {
      pusherClient?.unsubscribe(channelName);
      channel.unbind("newMessage", handleNewMessage);
    };
  }, [
    currentUser?.id,
    selectedUser?.id,
    queryClient,
    playNotificationSound,
    soundEnabled,
  ]);

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      {message.trim() === "" && (
        <CldUploadWidget
          signatureEndpoint={"/api/sign-cloudinary-params"}
          onSuccess={(result, { widget }) => {
            setImageUrl(
              (result?.info as CloudinaryUploadWidgetInfo).secure_url
            ); // { public_id, secure_url, etc }
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <ImageIcon
                onClick={() => open()}
                size={20}
                className="cursor-pointer text-muted-foreground"
              />
            );
          }}
        </CldUploadWidget>
      )}

      <Dialog open={!!imageUrl}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center relative h-96 w-full mx-auto">
            {imageUrl ? ( // ✅ Only render if imageUrl is valid
              <Image
                src={imageUrl}
                alt="image-preview"
                objectFit="contain"
                fill
              />
            ) : (
              <p className="text-gray-500">No image selected</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                sendMessage({
                  content: imageUrl,
                  messageType: "images",
                  receiverId: selectedUser?.id as string,
                });
                setImageUrl("");
              }}
            >
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AnimatePresence>
        <motion.div
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
          className="w-full relative"
        >
          <Textarea
            autoComplete="off"
            placeholder="Aa"
            rows={1}
            className="w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background min-h-0"
            value={message as string}
            onChange={(e) => {
              setMessage(e.target.value);
              if (soundEnabled) {
                playRandomSound()();
              }
            }}
            onKeyDown={handleKeyDown}
          />
          <div className="absolute right-2 bottom-0.5">
            <EmojiPickerComponent setMessage={setMessage} />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:text-white shrink-0"
            variant={"ghost"}
            size={"icon"}
            key={1}
            onClick={handleSendMessage}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          <Button
            className="h-9 w-9 dark:bg-muted dark:text-muted-foreground dark:hover:text-white shrink-0"
            variant={"ghost"}
            size={"icon"}
            key={2}
            onClick={() => {
              console.log("clicked");
              sendMessage({
                content: "👍",
                messageType: "text",
                receiverId: selectedUser?.id as string,
              });
            }}
          >
            {isPending ? (
              <Loader
                size={20}
                className="text-muted-foreground animate-spin"
              />
            ) : (
              <ThumbsUp size={20} className="text-muted-foreground" />
            )}
          </Button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBottomBar;
