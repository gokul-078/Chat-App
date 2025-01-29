
// importing 'Schema' and 'model' from mongoose module package...
const { Schema, model } = require('mongoose')

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {timestamps: true}
);



const Message = model('Message', messageSchema);  // This line creates a collection in our mongoDB named as "messages" eventhough we name is as "Message" it creates as "messages" thats the format in mongoDB.

module.exports = Message;