import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  return io;
};

export default setupSocket;