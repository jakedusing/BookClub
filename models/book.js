const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: String,
  image: String,
  author: String,
  description: String,
});

module.exports = mongoose.model("Book", BookSchema);
