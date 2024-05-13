import { Server } from "socket.io";
import http from "http";



const server = http.createServer();


// const io = new Server({
//   cors:{
//     origin: "https://soft-selkie-2e64e3.netlify.app/",
//     credentials: true
//   },
// });

const io = new Server({
  cors:{
  origin: (origin, callback) => {
    if (!origin || origin === " https://estatefrontend-fhne7fwk1-dhruv-patels-projects-5e029139.vercel.app") {
      callback(null, true); 
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow credentials to be included in requests
}});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    io.to(receiver.socketId).emit("getMessage", data);
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen("4000");
export default io;
