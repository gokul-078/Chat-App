
// import cloudinary...
const { v2: cloudinary } = require('cloudinary')

// import 'dotenv'..
const { config } = require('dotenv')
config();
/* require('dotenv').config(); */  // This is another way to import 'dotenv' config..


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


module.exports = cloudinary;




