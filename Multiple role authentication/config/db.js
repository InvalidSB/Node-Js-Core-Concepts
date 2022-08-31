const mongoose = require("mongoose");

const dburi =
  "mongodb+srv://test:58R37oySqCMNvJVH@cluster0.b6utj.mongodb.net/vibesBackendChallenge?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// make function that connect to mongodb uri and import it later on app.js
const connectDB = async () => {
  try {
    await mongoose.connect(dburi, connectionParams);
    console.log("Successfuly Connected to database ");
  } catch (error) {
    console.error(`Error connecting to the database. \n${error}`); //show error if exist any
  }
};

// exporting function as module
module.exports = connectDB;
