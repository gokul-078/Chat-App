
const express = require('express')

// importing router from express module...
const { Router } = require('express');

// importing the auth.controllers funtions file...
const { signup, login, logout, updateProfile, checkAuth } = require('../controllers/auth.controller');

// importing the auth.middleware file...
const protectedRoute = require('../middlewares/auth.middleware');

// assigning a variable to the router...
const router = Router();


// creating the sigup, login and logout page routes...
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

// creating the updateProfile and it need to be authenticated so we provide the 'protectedRoute' middleware for checks...
router.put("/update-profile", protectedRoute, updateProfile)

// creating checkAuth router with protectedRoute for authentication to checking the user activity...
router.get("/check", protectedRoute, checkAuth)





module.exports = router