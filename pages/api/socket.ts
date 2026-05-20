import type { NextApiRequest, NextApiResponse } from "next";
import { createSocketServer } from "@/lib/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function socketHandler(req: NextApiRequest, res: NextApiResponse) {
  const socketServer = (res.socket as any)?.server;
  if (socketServer && !socketServer.io) {
    const io = createSocketServer(socketServer);
    socketServer.io = io;
  }

  res.status(200).end();
}
