const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: String,
  image: String,
  author: String,
  description: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

BookSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Book", BookSchema);
