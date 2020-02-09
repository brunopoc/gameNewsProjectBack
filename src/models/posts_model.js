const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    resume: {
        type: String,
    },
    likes: {
        type: Number,
    },
    commentsCount: {
        type: Number,
    },
    author: {
        name: { 
            type: String,
            trim: true
        }
    },
    postType: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    categories: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    postSchedule: [{
        type: String,
        trim: true
    }]
});

module.exports = mongoose.model('Posts', schema);