const router = require("./Routes/index");
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require('cookie-parser')
const mongoose = require("mongoose");
require('dotenv').config();

app.use('/static', express.static('public'));
// Connecter à MongoDB
const uri = process.env.MONGODB_URI;


// Connection to the database
mongoose
    .connect(uri)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.log('Error connecting to database: ', error);
    });



// middleware to parse incoming requests
app.use(express.json());
// middleware to parse cookies
app.use(cookieParser());

// middleware to connect with frontend
app.use(cors({
    origin: ["https://www.strategicdash.com", "https://strategic-chatbot.vercel.app"],
    credentials: true,
}));



// middleware to load routes
app.use('/', router);


const PORT = process.env.API_PORT;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});


module.exports = app;