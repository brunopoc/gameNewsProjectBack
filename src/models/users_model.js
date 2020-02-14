const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String, 
        required: true,
        trim: true, 
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        trim: true,
        default: "user"
    },
    blocked: {
        type: Boolean,
        default: false
    },
    checkedProfile: {
        type: Boolean,
        default: false
    },
    likedPosts: [{
        type: String
    }]
});

schema.set('toJSON', {getters: true, virtuals: true});

module.exports = mongoose.model('User', schema);