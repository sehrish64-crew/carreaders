import { Server } from "socket.io";

declare global {
  var socketServer: Server | undefined;
}

export function createSocketServer(server: any) {
  if (global.socketServer) {
    return global.socketServer;
  }

  const io = new Server(server, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
    });
  });

  global.socketServer = io;
  return io;
}

export function getSocketServer() {
  return global.socketServer;
}

export function emitRealtimeEvent(event: string, payload: unknown) {
  global.socketServer?.emit(event, payload);
}
