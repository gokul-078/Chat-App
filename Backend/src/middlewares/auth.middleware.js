
// importing the jsonwebtoken in to our file...
const jwt = require('jsonwebtoken')

// import User from usermodel file it's the data storing database format file...
const User = require("../models/usermodel")

const protectedRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;   // Here, we getting the jwt token from the user who have account in database.

        // Check whether the token is provided or not..
        if(!token){
            return res.status(401).json({message: "Unauthorized - No token provided!"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Check decoded value is correct or not...
        if(!decoded){
            return res.status(401).json({message: "Unauthorized - Invalid token"})
        }

        // If the decoded is passed then proceed to get the requested userId...
        const user = await User.findById(decoded.userId).select("-password")

        // check user..
        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        // If everything set then we proceed to go with the next...
        // We are assigning the user to req.user for updateprofile...
        req.user = user;
        // Then it pass it to updateProfile function...
        next();
    }
    catch(error){
        console.log("Authentication failed", error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

module.exports = protectedRoute;