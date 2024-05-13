// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import authRoute from "./routes/auth.route.js";
// import postRoute from "./routes/post.route.js";
// import testRoute from "./routes/test.route.js";
// import userRoute from "./routes/user.route.js";
// import chatRoute from "./routes/chat.route.js";
// import messageRoute from "./routes/message.route.js";
// import path from "path";
// import http from "http";
// import io from "./socket/app.js";
// import connection  from "mongoose";


// const app = express();
// const server = http.createServer(app);



// // app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
// // Allow requests from all origins
// // app.use(cors({ origin:"https://soft-selkie-2e64e3.netlify.app/", credentials: true }));
// app.use(cors({ origin : " https://estatefrontend-fhne7fwk1-dhruv-patels-projects-5e029139.vercel.app", credentials: true}));
// app.use(express.json());
// app.use(cookieParser());

// app.use("/api/auth", authRoute);
// app.use("/api/users", userRoute);
// app.use("/api/posts", postRoute);
// app.use("/api/test", testRoute);
// app.use("/api/chats", chatRoute);
// app.use("/api/messages", messageRoute);

// // ------------------------------------Deployment---------------------------------------

// // // Define the directory where the server script is located
// // const __dirname = path.resolve();

// // if (process.env.NODE_ENV === 'production') {
// //   // Serve static files from the 'client/dist' directory
// //   app.use(express.static(path.join(__dirname,'..', 'client/dist')));

// //   // Serve the 'index.html' file for any route
// //   app.get('*', (req, res) => {
// //     res.sendFile(path.resolve(__dirname, '..','client', 'dist', 'index.html'));
// //   });
// // } else {
// //   // In development mode, respond with a message for the root route
// //   app.get('/', (req, res) => {
// //     res.send('API is running successfully');
// //   });
// // }

// // ------------------------------------Deployment---------------------------------------


// io.listen(server);

// app.listen(process.env.PORT, async () => {
//   try {
//     connection;
//     console.log(`connected to mongo db`)
//   } catch (err) {
//     console.log("Error in connecting mongoDb");
//   }
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import connection from "mongoose";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin === "https://estatefrontend-fhne7fwk1-dhruv-patels-projects-5e029139.vercel.app") {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true // Allow credentials to be included in requests
  }
});

app.use(cors({
  origin: "https://estatefrontend-fhne7fwk1-dhruv-patels-projects-5e029139.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// ------------------------------------Deployment---------------------------------------
// Place your deployment-related code here
// ------------------------------------Deployment---------------------------------------

let onlineUsers = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find(user => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.log(`User with ID ${receiverId} not found.`);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

const backendPort = process.env.BACKEND_PORT || 8800;
const socketIoPort = process.env.SOCKET_IO_PORT || 4000;

server.listen(backendPort, async () => {
  try {
    connection;
    console.log(`Connected to MongoDB`);
  } catch (err) {
    console.log("Error in connecting to MongoDB");
  }
  console.log(`Backend server is running on port ${backendPort}`);
});

io.listen(socketIoPort);
console.log(`Socket.io server is running on port ${socketIoPort}`);
