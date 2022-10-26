const cloudinary = require('cloudinary');
const fs = require('fs');

const imagekit = cloudinary.config({ 
    cloud_name: 'qumail', 
    api_key: '264953215572456', 
    api_secret: 'uVYF-TvoEol3QLzu9uA_lFhOBeQ',
    secure: true
  });

exports.uploadFile = async (file) => {
    try {
      const image = await cloudinary.uploader.upload(file.tempFilePath);
      return image.url;

    } catch (error) {
        return error;
    }
}