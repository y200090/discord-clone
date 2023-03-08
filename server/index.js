const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const tokenRoute = require('./routes/token');

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoute);
app.use('/token', tokenRoute);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB!');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('Server is running!');
});
