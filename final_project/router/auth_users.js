const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
const secretKey = 'your_secret_key'; // Change this to your actual secret key
const { creds } = require('./general');
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username exists and password is correct
    const user = creds.find(creds => creds.username === username && creds.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const accessToken= jwt.sign({ username: user.username }, 'access', { expiresIn: '1h' });

    req.session.authorization = {
        accessToken
    }
    return res.status(200).json({ message: "Login successful"});
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.query;
    const username = req.session.username; // Assuming username is stored in session

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already posted a review for the given ISBN
    if (books[isbn].reviews[username]) {
        // If the user has already posted a review for the given ISBN, modify it
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review modified successfully" });
    } else {
        // If the user has not posted a review for the given ISBN, add a new review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Get the username from the session


    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has reviewed the book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = {creds};
