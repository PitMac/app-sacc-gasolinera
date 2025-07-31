import { io } from "socket.io-client";

let socketInstance = null;

export const connectSocket = (socketParam) => {
  if (!socketInstance) {
    const url = socketParam?.url;
    const urlpath = socketParam?.path;
    socketInstance = io(url, {
      transports: ["websocket"],
      reconnection: true,
      path: urlpath,
    });

    socketInstance.on("connect", () => {
      console.log("🔌 Socket conectado");
    });

    socketInstance.on("disconnect", () => {
      //console.log("❌ Socket desconectado");
    });
  }

  return socketInstance;
};

export const getSocket = () => {
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
