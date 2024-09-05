const mongoose = require("mongoose");
const Book = require("../models/book");

mongoose.connect("mongodb://localhost:27017/bookclub");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Book.deleteMany({});
  const c = new Book({ title: "ignition" });
  await c.save();
};

seedDB();
