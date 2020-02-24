const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    url: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: String, 
        trim: true,
        default: 'notinformed'
    },
});

schema.set('toJSON', {getters: true, virtuals: true});

module.exports = mongoose.model('Upload', schema);