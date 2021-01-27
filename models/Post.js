const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    body: String,
    username: String,
    createdAt: String,
    comments: [{
        body: String, 
        username: String, 
        createdAT: String
    }],
    likes: [{
        username: String, 
        createdAt: String}]
});

module.exports = model('Post', postSchema);
   