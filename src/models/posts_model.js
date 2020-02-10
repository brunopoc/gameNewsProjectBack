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
        default: 0
    },
    comments: [{
        text: { 
            type: String,
            trim: true 
        },
        commentedAt: {
            type: Date,
            default: Date.now
        },
        author: {
            type: String,
            trim: true
        }
    }],
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
        label: {
            type: String,
            trim: true
        },
        value: {
            type: String,
            trim: true
        }
    }],
    tags: [{
        label: {
            type: String,
            trim: true
        },
        value: {
            type: String,
            trim: true
        }
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