// models/User.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  data: Buffer,
  contentType: String,
});

const userSchema = new mongoose.Schema({
  firstname: String, // Ensure firstname is unique
  lastname: String,
  email: String,
  number: Number,
  password: String,
  bio: { type: String, default: '' }, // Add the bio field
  profileImage: {
    data: Buffer,
    contentType: String,
  },
  videos: [videoSchema], // Array of video subdocuments
});

module.exports = mongoose.model('User', userSchema);
