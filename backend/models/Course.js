const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  courseId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  courseDuration: {
    type: String,
    required: true,
    trim: true,
  },
  courseFee: {
    type: Number,
    required: true,
    min: 0
  },
  courseDescription: {
    type: String,
    trim: true,
    default: ''
  }
});

module.exports = mongoose.model("Course", courseSchema);
