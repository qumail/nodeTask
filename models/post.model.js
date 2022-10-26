const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 20,
    }, 

    description: {
        type: String,
        minLength: 10,
        maxLength: 3000,
        required: true
    },

    tags: [
        {
            type: String,
        }
    ],

    image: String,

    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      },



}, 
{
    timestamps: true,
}
);

module.exports = mongoose.model('Post', postSchema);