const express = require('express');
const adminApp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const UserAuthor = require('../models/userauthor');
const Article = require('../models/articleModel');

adminApp.get('/', (req, res) => {
    res.send('Admin API is working');
});

// Get all users and authors (admin view)
adminApp.get('/users', expressAsyncHandler(async (req, res) => {
    const allUsersAuthors = await UserAuthor.find();
    res.status(200).send({ message: "All users and authors retrieved", payload: allUsersAuthors });
}));

// Get all articles including inactive ones (admin view)
adminApp.get('/articles', expressAsyncHandler(async (req, res) => {
    const allArticles = await Article.find();
    res.status(200).send({ message: "All articles retrieved", payload: allArticles });
}));
module.exports = adminApp;