const mongoose = require("mongoose");
const bookSeeds = require("./bookSeeds");
const Book = require("../models/book");

mongoose.connect("mongodb://localhost:27017/bookclub");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// Function to seed the database with book data
const seedDB = async () => {
  // Delete all existing books in the database
  await Book.deleteMany({});

  // Loop to create 40 new book entries
  for (let i = 0; i < 40; i++) {
    // Generate a random index between 0 and 59 (inclusive) to select a book seed
    const random60 = Math.floor(Math.random() * 60);

    // Create a new book instance with random data from bookSeeds
    const book = new Book({
      // Set the book title from the randomly selected seed
      title: bookSeeds[random60].title,
      // Set the book author from the randomly selected seed
      author: bookSeeds[random60].author,
      // Assign a static user ID (replace with a dynamic user ID as needed)
      user: "6701ef401799716b86f31afa",
      // Set the book description from the randomly selected seed
      description: bookSeeds[random60].description,
      // Set an array of images for the book
      images: [
        {
          // URL of the first image
          url: "https://res.cloudinary.com/dhrx7lpij/image/upload/v1729178695/BookClub/gwxftzzdflp4snisxxsy.png",
          // Filename for the first image (used for referencing in Cloudinary)
          filename: "BookClub/gwxftzzdflp4snisxxsy",
        },
        {
          // URL of the second image
          url: "https://res.cloudinary.com/dhrx7lpij/image/upload/v1729178695/BookClub/eh1kk7agcjawvravv13c.jpg",
          // Filename for the second image
          filename: "BookClub/eh1kk7agcjawvravv13c",
        },
      ],
    });

    // Save the newly created book to the database
    await book.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
