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
    }
});

module.exports = mongoose.model('Categories', schema);