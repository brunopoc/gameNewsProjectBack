const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answaresSchema = new Schema({
    text: { 
        type: String,
        trim: true 
    },
    commentedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        name: {
            type: String,
            trim: true,
            required: true 
        },
        id:  {
            type: String,
            trim: true,
            required: true 
        },
        image: {
            type: String,
            trim: true
        },
    },
});

const commentsSchema = new Schema({
    text: { 
        type: String,
        trim: true 
    },
    commentedAt: {
        type: Date,
        default: Date.now
    },
    author: {
        name: {
            type: String,
            trim: true,
            required: true 
        },
        id:  {
            type: String,
            trim: true,
            required: true 
        },
        image: {
            type: String,
            trim: true,
        },
    },
    answares: [answaresSchema]
});

const postSchema = new Schema({
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
    views: {
        type: Number,
        default: 0
    },
    comments: [commentsSchema],
    author: {
        name: { 
            type: String,
            trim: true
        },
        id: { 
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
    }],
    refer: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    aprove: {
        type: String,
        required: true,
        trim: true,
        default: "pending"
    },
});

answaresSchema.set('toJSON', {
    transform : (doc, result) => {
      return {
        ...result,
        id : result._id
      };
    }
});

commentsSchema.set('toJSON', {
    transform : (doc, result) => {
      return {
        ...result,
        id : result._id
      };
    }
});

postSchema.set('toJSON', {
    transform : (doc, result) => {
      return {
        ...result,
        id : result._id
      };
    }
});

module.exports = mongoose.model('Posts', postSchema);