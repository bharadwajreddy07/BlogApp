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
        // make lastname optional because some auth providers may not provide it
        // store an empty string by default to avoid validation errors
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profileimageURL: {
        type: String,
        // keep profile image required as before
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { strict: "throw" });

const UserAuthor = mongoose.model("UserAuthor", userAuthorSchema);

module.exports = UserAuthor;