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

  // const userSocketMap = new Map<string, string>();

  // const disconnect = (socket: Socket) => {
  //   for (const [userId, socketId] of userSocketMap) { // the default is userSocketMap.entries, so we dont want to mention it !
  //     if (socketId === socket.id) {
  //       userSocketMap.delete(userId);
  //       console.log(`User ${userId} disconnected with socket id: ${socket.id} 🔴`);
  //       break;
  //     }
  //   }
  // }

  // io.on("connection", (socket: Socket) => {

  //   const userId = socket.handshake.auth.userId as string;

  //   if (userId) {
  //     userSocketMap.set(userId, socket.id);
  //     console.log(`User ${userId} connected with socket id: ${socket.id} 🏳️`);
  //   } else {
  //     console.log('UserId not provided during connention !');
  //   }

  //   socket.on('send_message', (data) => {
  //     console.log(data);
  //   })

  //   socket.on('disconnect', () => disconnect(socket));
  // });

  return io;
};

export default setupSocket;