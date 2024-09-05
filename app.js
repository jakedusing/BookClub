const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Book = require("./models/book");

mongoose.connect("mongodb://localhost:27017/bookclub");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makebook", async (req, res) => {
  const book = new Book({
    title: "Lost Stars",
    description: "a great star wars novel!",
  });
  await book.save();
  res.send(book);
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
