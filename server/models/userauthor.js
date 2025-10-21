const mongoose = require("mongoose");

const userAuthorSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ["user", "author", "admin"],
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileimageURL: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { strict: "throw" });

const UserAuthor = mongoose.model("UserAuthor", userAuthorSchema);

module.exports = UserAuthor;