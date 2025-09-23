const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./.env" }); // explicitly tell it to use root .env

console.log("MONGO_URI is:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});
