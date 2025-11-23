const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
    
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});



const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Stayatra_DEV',
    aallowedFormats: ['jpeg', 'png', 'jpg'], // supports promises as well
   
  },
});

cloudinary.api.ping().then((res) => {
  console.log("Cloudinary connection successful: ", res);
}).catch((err) => {
  console.error("Cloudinary connection failed:", err);
});


module.exports = { cloudinary, storage };