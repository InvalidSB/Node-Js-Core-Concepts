const express = require('express')
const app = express()
const PORT = 8000
const cors = require("cors");
const bodeyParser = require("body-parser");
const passport = require("passport");

const connectDB = require('./config/db')

// connection with mongodb
connectDB()


// Middlewares
app.use(cors());
app.use(bodeyParser.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

// all the authentication related routes connected to application through here
app.use("/api/users", require("./routes/users"));



app.listen(PORT, (req,res)=>{
    console.log(`server is running on port ${PORT}`)
})