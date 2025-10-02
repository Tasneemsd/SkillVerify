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
    type: String, // e.g., "6 months"
    required: true,
    trim: true,
  },


  courseDescription: {
    type: String,
    trim: true,
    default: "",
  },
  rating: {
    type: Number,
    default: 4.5, // shown as ★4.5
  },
  stipend: {
    type: String,
    default: "Min. 5K- 10K/month",
  },
  placementPartners: {
    type: [String], // e.g., ["Samsung", "Xto10x", "Haptik"]
    default: [],
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
