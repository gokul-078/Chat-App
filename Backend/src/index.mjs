
// importing express...
const express = require('express')
// import environmental variables .env package..
require('dotenv').config();
// importing cookie-parser package...
const cookieParser = require('cookie-parser')
// importing cors middleware...
const cors = require('cors')

// importing path module from path package...
const path = require("path")

// importing the app from respected file... It is the express holding variable...
const { app, server } = require('./lib/socket.js');

// importing env variable port...
const PORT = process.env.PORT
// Assigning path resolve property to __dirname variable....
const __dirname = path.resolve();

// importing the route path file...
const authRoutes = require('./routes/auth.route.js');
const messageRoutes = require('./routes/message.route.js');

// import the mongodb connection database file from lib folder... 
const connectDB = require('./lib/db.js');


// using middlewares:
// Json builtin middlewares:
app.use(express.json({extended: true}))
// Url builtin middlewares it is used to handle the form methods:
app.use(express.urlencoded({extended: true}))
// cookieParser middleware is used to parse the cookies...
app.use(cookieParser())
// cors middleware...
app.use(cors({ origin: "http://localhost:5173", credentials: true}))




// Creating a api or route path for pages...
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)


if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../Frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
    })
}


server.listen(PORT, () => {
    console.log("Server is running on PORT: "+PORT)
    connectDB();
})