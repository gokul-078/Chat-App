// importing server from socket package...
const { Server } = require("socket.io");
// importing http package from node.js...
const http = require("http");
// importing express from express...
const express = require('express');

// Assigning express to a app variable...
const app = express();

// Creating a server with the help of http modules...
const server = http.createServer(app)

// Now we give the created server inside the socket.io...
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})


const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}


// Used to store online user...
const userSocketMap = {};  // {userId: socket.id}

// Now checking for the connection and disconnect with the help of socket...
io.on("connection", (socket) => {
    console.log("A user connected", socket.id)

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id
    }

    // io.emit() is used to send events to all users...
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("A user is disconnected", socket.id)
        delete userSocketMap[userId]
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })
})




module.exports = { io, app, server, getReceiverSocketId };