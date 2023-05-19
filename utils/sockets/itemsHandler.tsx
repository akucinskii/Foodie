import { Socket } from "socket.io";

const itemsHandler = (io: any, socket: Socket) => {
  const createdMessage = (msg: String) => {
    socket.emit("newIncomingMessage", msg);
  };

  socket.on("createdMessage", createdMessage);
};

export default itemsHandler;
