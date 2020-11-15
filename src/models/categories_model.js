const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        trim: true,
        default: 'old'
    }
});

module.exports = mongoose.model('Categories', schema);