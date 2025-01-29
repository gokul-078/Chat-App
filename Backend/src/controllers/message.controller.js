
// import 'User' from usermodel file it's the data storing database format file...
const User = require("../models/usermodel");

// import 'Message' from messagemodel file it's the data storing database format file...
const Message = require("../models/messagemodel");

// import cloudinary...
const cloudinary = require("../lib/cloudinary")

const { getReceiverSocketId, io } = require("../lib/socket")


// ======================= Get the list of users to show in the sidebar ======================== 

const getUsersForSidebar = async (req, res) => {
    try {
        // Assigning user id to the loggedInUserId variable, We get the user details from the protectedRoutes...
        const loggedInUserId = req.user._id;
        // Finding the all users in database except the currently logged in user..., The '"$ne": loggedInUserId' refers the exception of the currently loggedIn user...
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId} }).select("-password");
        
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getting user for sidebar", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}



// ====== Get messages of the particular(clicking) users it's like opening a chatbox of some users in our whatsapp =======

const getMessages = async (req, res) => {
    try {
        // Getting the user id of whom we going to chat or clicking the user in the page...
        const { id: userToChatId } = req.params;
        // Getting our Id from the protectedRoute...
        const myId = req.user._id;

        // Next, getting all the messages that both receiver and sender had in their end as vice versa.... So we used "$or" property here it has two parameters senderId and receiverId..
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId}
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getting messages", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}



// ===================== Sending messages to a particular users =========================

const sendMessage = async (req, res) => {
    try {
        // Getting the text, image, receiverId and senderId from the request...
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        
        let imageUrl;
        // Checking whether the sender sent an image or not and update it in cloudinary...
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url 
        }

        // Finally sending the message to the database or to the receiver...
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // todo: realtime functionality goes here socket.io 
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("Error in sending messages", error.message)
        res.status(500).json({error: "Internal server error"})
    }
}










module.exports = { getUsersForSidebar, getMessages, sendMessage }

