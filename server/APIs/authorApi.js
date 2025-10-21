const express = require('express');
const authorApp = express.Router();
const expressAsyncHandler = require('express-async-handler');
const createUserOrAuthor = require('./createUserorAuthor');
const Article = require('../models/articleModel');
authorApp.post('/author', expressAsyncHandler(createUserOrAuthor));
//create a new article
authorApp.post('/article', expressAsyncHandler(async (req, res) => {
    const newArticle = new Article(req.body);
    const newart = await newArticle.save();
    res.status(201).send({ message: "Article created successfully", payload: newart });
}));
//get all the articles
authorApp.get('/articles', expressAsyncHandler(async (req, res) => {
    const articles = await Article.find({ isArticleActive: true });
    res.status(200).send({ message: "Articles retrieved successfully", payload: articles });
}));
//modify an article by Id (supports both MongoDB _id and custom articleId)
authorApp.put('/article/:articleId', expressAsyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const updateData = req.body;
    const { Types } = require('mongoose');
    
    let articleDb = null;
    
    // Check if it's a valid MongoDB ObjectId (24 hex chars)
    if (Types.ObjectId.isValid(articleId) && articleId.length === 24) {
        // Update by MongoDB _id
        articleDb = await Article.findByIdAndUpdate(articleId, { ...updateData }, { returnOriginal: false });
    } else {
        // Update by custom articleId field
        articleDb = await Article.findOneAndUpdate({ articleId: String(articleId) }, { ...updateData }, { returnOriginal: false });
    }
    
    if (!articleDb) {
        return res.status(404).send({ message: "Article not found" });
    }
    
    res.status(200).send({ message: "Article updated successfully", payload: articleDb });
}));


//delete an article by Id (supports both MongoDB _id and custom articleId)
authorApp.delete('/articles/:articleId', expressAsyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const { Types } = require('mongoose');
    
    let deletedArticle = null;
    
    // Check if it's a valid MongoDB ObjectId (24 hex chars)
    if (Types.ObjectId.isValid(articleId) && articleId.length === 24) {
        // Delete by MongoDB _id
        deletedArticle = await Article.findByIdAndDelete(articleId);
    } else {
        // Delete by custom articleId field
        deletedArticle = await Article.findOneAndDelete({ articleId: String(articleId) });
    }
    
    if (!deletedArticle) {
        return res.status(404).send({ message: "Article not found" });
    }
    
    res.status(200).send({ message: "Article deleted successfully", payload: deletedArticle });
}));


module.exports = authorApp;