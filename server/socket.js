// socket.js
let io;

export async function initSocket(server) {
  const { Server } = await import("socket.io");
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export { io };
