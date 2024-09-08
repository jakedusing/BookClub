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

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/books", async (req, res) => {
  const books = await Book.find({});
  res.render("books/index", { books });
});

app.get("/books/new", (req, res) => {
  res.render("books/new");
});

app.post("/books", async (req, res) => {
  const book = new Book(req.body.book);
  await book.save();
  res.redirect(`/books/${book._id}`);
});

app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render("books/show", { book });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
