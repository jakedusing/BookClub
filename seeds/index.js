const mongoose = require("mongoose");
const bookSeeds = require("./bookSeeds");
const Book = require("../models/book");

mongoose.connect("mongodb://localhost:27017/bookclub");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Book.deleteMany({});
  for (let i = 0; i < 40; i++) {
    const random60 = Math.floor(Math.random() * 60);
    const book = new Book({
      title: bookSeeds[random60].title,
      author: bookSeeds[random60].author,
      user: "6701ef401799716b86f31afa",
      description: bookSeeds[random60].description,
      images: [
        {
          url: "https://res.cloudinary.com/dhrx7lpij/image/upload/v1729178695/BookClub/gwxftzzdflp4snisxxsy.png",
          filename: "BookClub/gwxftzzdflp4snisxxsy",
        },
        {
          url: "https://res.cloudinary.com/dhrx7lpij/image/upload/v1729178695/BookClub/eh1kk7agcjawvravv13c.jpg",
          filename: "BookClub/eh1kk7agcjawvravv13c",
        },
      ],
    });
    await book.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
