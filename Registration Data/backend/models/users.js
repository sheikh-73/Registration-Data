const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    profession: {type: String, required: true},
    gender: {type: String, required: true},
    password: {type: String, required: true},
    image: {type: String, required: true}
});

const User = mongoose.model("users", userSchema);
module.exports = User;