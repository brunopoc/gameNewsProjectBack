const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  accused: {
    name: { type: String, required: true, trim: true },
    id: { type: String, required: true, trim: true },
  },
  informer: {
    name: { type: String, required: true, trim: true },
    id: { type: String, required: true, trim: true },
  },
  refer: {
    type: { type: String, required: true, trim: true },
    id: { type: String, required: true, trim: true }
  },
  info: { type: String, required: true, trim: true },
  createdAt: {
    type: Date,
    default: Date.now
},
});

schema.set("toJSON", { getters: true, virtuals: true });

module.exports = mongoose.model("Complaints", schema);
