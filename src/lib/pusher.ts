import PusherServer from "pusher";
import PusherClient from "pusher-js";

declare global {
  var pusherClient: PusherClient | undefined;
  var pusherServer: PusherServer | undefined;
}

export const pusherServer =
  global.pusherServer ||
  (global.pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: "ap2",
    useTLS: true,
  }));

export const pusherClient =
  global.pusherClient ||
  (global.pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
      cluster: "ap2",
    }
  ));
