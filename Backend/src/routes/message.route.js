
const express = require('express')

// importing router from express module...
const { Router } = require('express');

// assigning a variable to the router...
const router = Router();

// importing required files...
const protectedRoute = require('../middlewares/auth.middleware');
const { getUsersForSidebar, getMessages, sendMessage } = require('../controllers/message.controller');




// creating a getUsersForSidebar, getMessages, sendMessage for message routes...
router.get("/users", protectedRoute, getUsersForSidebar)
router.get("/:id", protectedRoute, getMessages)
router.post("/send/:id", protectedRoute, sendMessage)











module.exports = router