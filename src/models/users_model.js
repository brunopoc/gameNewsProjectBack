const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nickname: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String, 
        trim: true, 
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: String,
        select: false,
    },
    emailConfirmToken: {
        type: String,
        select: false,
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
    emailChecked: {
        type: Boolean,
        default: false
    },
    likedPosts: [{
        type: String
    }],
    avatar: {
        type: String,
        trim: true
    }
});

schema.set('toJSON', {getters: true, virtuals: true});

module.exports = mongoose.model('User', schema);