import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

interface Users {
    id: string;
    username: string;
    room: string;
}

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

const users: Users[] = [];

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username }) => {
        let user;

        if (users.length === 0 || users.length === 4) {
            user = {
                id: socket.id,
                username,
                room: socket.id,
            };
            users.push(user);
            socket.join(user.room);
        } else if (users.length > 0) {
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
                room: users[4].room,
            };
            users.push(user);
            socket.join(users[4].room);
        }
        socket.broadcast.emit("usersList", users);
        socket.emit("usersList", users);
    });

    socket.on("closeRoom", ({ username }) => {
        users.find((user) => {
            if (user.username === username) {
                socket.leave(user.room);
                users.splice(users.indexOf(user), 1);
            }
        });
    });

    socket.on("sendChoice", (data) => {
        io.to(data.room).emit("receiveChoice", data);
    });
});

server.listen(3000, () => {
    console.log("Server is running!");
});
