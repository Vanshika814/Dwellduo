const mongoose = require("mongoose");
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://amigo:amigo@projectapp.8yr0g10.mongodb.net/?retryWrites=true&w=majority&appName=projectapp";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = { mongoose }; // Export the active connection.
