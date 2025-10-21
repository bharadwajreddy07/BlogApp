const express = require('express');
const userApp = express.Router();
const UserAuthor = require('../models/userauthor');
const expressAsyncHandler = require('express-async-handler');
const createUserOrAuthor = require('../APIs/createUserorAuthor');
const Article = require('../models/articleModel');

// Get user info (for the GET /userApi/user request)
userApp.get('/user', expressAsyncHandler(async (req, res) => {
    res.status(200).send({ message: "User API is working", endpoint: "/userApi/user" });
}));

//create a new user
userApp.post('/user', expressAsyncHandler(createUserOrAuthor));

// Get all users
userApp.get('/users', expressAsyncHandler(async (req, res) => {
    const users = await UserAuthor.find({ role: 'user' });
    res.status(200).send({ message: "Users retrieved successfully", payload: users });
}));

// Get all articles (user view - all active articles)
userApp.get('/articles', expressAsyncHandler(async (req, res) => {
    const articles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "Articles retrieved successfully", payload: articles });
}));

// Add comment to article by articleId (supports custom articleId or Mongo _id)
userApp.put('/comment/:articleId', expressAsyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const commentObj = req.body;
    const { Types } = require('mongoose');
    
    let articlewithcomments = null;
    if (Types.ObjectId.isValid(articleId) && articleId.length === 24) {
        articlewithcomments = await Article.findByIdAndUpdate(articleId, { $push: { comments: commentObj }}, { returnOriginal: false });
    } else {
        articlewithcomments = await Article.findOneAndUpdate({ articleId: String(articleId) }, { $push: { comments: commentObj }}, { returnOriginal: false });
    }
    
    if (!articlewithcomments) {
        return res.status(404).send({ message: "Article not found" });
    }
    res.status(200).send({ message: "Comment added successfully", payload: articlewithcomments });
}));
module.exports = userApp;