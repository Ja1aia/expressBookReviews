const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require('fs');

let creds = []; // Array to store registered users

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    if (creds.find(creds => creds.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the new user
    creds.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

module.exports = { creds }; // Export the creds array


const axios = require('axios');

const getBooksAsync = async () => {
    try {
        const response = await axios.get('localhost:5000/'); 
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error; 
    }
};

module.exports = {
    getBooksAsync: getBooksAsync // Export the function to be used in other modules
};


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const booksArray = Object.values(books);
    res.json(booksArray, null, 2);
});

// Function to get book details based on ISBN using a Promise with a simulated delay
const getBookDetailsPromise = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const bookDetails = {
                isbn: isbn,
                title: "Book Title",
                author: "Book Author",
                description: "Book Description"
            };
            resolve(bookDetails); 
        }, 2000);
    });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const bookDetails = await getBookDetailsPromise(isbn);
        res.json(bookDetails); // Send book details as JSON response
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ message: 'Internal server error' }); // Send 500 response for server errors
    }
});

module.exports = {
    getBookDetailsPromise: getBookDetailsPromise // Export the function to be used in other modules
};


// Function to get book details based on author using a Promise with a simulated delay
const getBookDetailsByAuthorPromise = (author) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulating a delay of 6 seconds before resolving the promise
            // In a real scenario, this delay would be replaced with the actual HTTP GET request
            const booksArray = Object.values(books);
            const book = booksArray.find(book => book.author === author);

            if (!book) {
                reject({ message: "Book not found" }); // Reject the promise if the book is not found
            } else {
                resolve(book); // Resolve the promise with book details
            }
        }, 6000);
    });
};

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const bookDetails = await getBookDetailsByAuthorPromise(author);
        res.json(bookDetails); // Send book details as JSON response
    } catch (error) {
        console.error('Error fetching book details by author:', error);
        res.status(404).json({ message: 'Book not found' }); // Send 404 response if the book is not found
    }
});

module.exports = {
    getBookDetailsByAuthorPromise: getBookDetailsByAuthorPromise // Export the function to be used in other modules
};


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
     const booksArray = Object.values(books);
    const author = req.params.title;

    const book = booksArray.find(book => book.title === author);

    if (!book) {
        return res.status(404).json({ message: "Book not found" }); // Return a 404 response if the book is not found
    }

    return res.json(book);
});

//  Get book review
// Function to get book reviews based on ISBN using a Promise with a simulated delay
const getBookReviewsByISBNPromise = (isbn) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulating a delay of 6 seconds before resolving the promise
            // In a real scenario, this delay would be replaced with the actual database query
            const book = books[isbn];
            if (!book) {
                reject({ error: "Book not found" }); // Reject the promise if the book is not found
            } else {
                resolve(book.reviews); // Resolve the promise with book reviews
            }
        }, 6000);
    });
};

// Get book reviews based on ISBN
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters

    try {
        const bookReviews = await getBookReviewsByISBNPromise(isbn);
        res.json(bookReviews); // Send book reviews as JSON response
    } catch (error) {
        console.error('Error fetching book reviews by ISBN:', error);
        res.status(404).json({ error: 'Book not found' }); // Send 404 response if the book is not found
    }
});

module.exports = {
    getBookReviewsByISBNPromise: getBookReviewsByISBNPromise // Export the function to be used in other modules
};

module.exports.general = public_users;
