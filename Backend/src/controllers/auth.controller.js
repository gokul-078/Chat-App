
// import User from usermodel file it's the data storing database format file...
const User = require("../models/usermodel")

// import 'bcryptjs' from package:
const bcrypt = require('bcryptjs')

// import jwtToken(generate token) from utils file...
const generateToken = require("../lib/utils")

// import cloudinary...
const cloudinary = require("../lib/cloudinary")


// ========================= Sign Up ================================

const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try{
        // Check all the fields are filled...
        if(!fullName || !email || !password){
            return res.status(400).json({message: "Fill in all fields!"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be atleast 6 characters!"})
        }

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({message: "Email already exists!"})
        }

        const salt = await bcrypt.genSalt(10)
        // Hash the password with generated salt(it's is like it gives a security to our password):
        const hashedPassword = await bcrypt.hash(password, salt)

        // Insert the entered details to the database file...
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if(newUser){
            // generate jwt token for authentication purpose:
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else{
            res.status(400).json({message: "Invalid user data"})
        }
    }
    catch(error){
        console.log("Error in sigup ", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}




// ============================== Login =============================

const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        // Check whether all the fields are filled...
        if(!email || !password){
            return res.status(400).json({message: "Fill in all fields"})
        }

        // Check whether the email is exists or not...
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: "Invalid credentials"})
        }
        // If the email exist compare the password with bcrypt password..
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        // If all credentials are correct generate the token for authentication..
        generateToken(user._id, res);

        // Finally send a response...
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    }
    catch(error){
        console.log("Error in Login ", error.message)
        res.status(500).json({error: "Internal server error"})
    }

}



// =============================== Logout =========================

const logout = (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    }
    catch(error){
        console.log("Error in Logout", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}




// ============================= Update Profile ========================

const updateProfile = async (req, res) => {
    try {
        // Getting the request of profile pic from user through webpage...
        const { profilePic } = req.body;

        // We have the access to find which user is now logined already, because we caught the user in auth.middleware... during authentication process... and we assign that user id to a variable named userId...
        const user = req.user._id

        // Check whether the user requested profilePic or not...
        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }

        // After checking all conditions we are uploading profile pic to cloudinary...
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // Then we updating our User details in database...
        const updatedUser = await User.findByIdAndUpdate(user, {profilePic: uploadResponse.secure_url}, {new: true})

        res.status(200).json(updatedUser)

    } catch (error) {
        console.log("UpdateProfile is failed ", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}



// ============================ Check Authenticated =========================

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in Authentication checks", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}





module.exports = { signup, login, logout, updateProfile, checkAuth }