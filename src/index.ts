import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { IUsers } from "./utils/type";
import { countdown } from "./utils/countdown";

const app = express();
const server = http.createServer(app);
app.use(cors());

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

export const users: IUsers[] = [];


io.on("connection", (socket) => {

    socket.on("joinRoom", ({ username }) => {
        let user;

        if (users.length === 0 || users.length === 5) {
            user = {
                id: socket.id,
                username,
                room: socket.id,
            };
            users.push(user);
            socket.join(user.room);
            countdown(user.room);
        } else if (users.length > 0 && users.length < 5) {
            user = {
                id: socket.id,
                username,
                room: users[0].room,
            };
            users.push(user);
            socket.join(users[0].room);
        } else {
            user = {
                id: socket.id,
                username,
                room: users[5].room,
            };
            users.push(user);
            socket.join(users[5].room);
        }
        socket.broadcast.emit("usersList", users);
        socket.emit("usersList", users);
    });

    socket.on("sendAnswer", (data) => {
        io.to(data.room).emit("receiveAnswer", data);
    });

    socket.on("leaveRoom", ({ username, room }) => {
        const i = JSON.stringify(users.findIndex((val) => val.username === username));

        socket.leave(room);
        users.splice(Number(i), 1);

        io.emit("usersList", users);
    });
});

server.listen(3210, () => {
    console.log("Server is running!");
});
