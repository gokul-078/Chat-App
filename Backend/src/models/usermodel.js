
// importing 'Schema' and 'model' from mongoose module package...
const { Schema, model } = require('mongoose')

const userSchema = new Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        profilePic: {
            type: String,
            default: ""
        },
    },
    { timestamps: true }
);

const User = model('User', userSchema);  // This line creates a collection in our mongoDB named as "users" eventhough we name is as "User" it creates as "users" thats the format in mongoDB

module.exports = User;