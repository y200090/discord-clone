const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const serverRoute = require('./routes/server');
const channelRoute = require('./routes/channel');
const friendRoute = require('./routes/friend');
const messageRoute = require('./routes/message');

dotenv.config();

app.use(express.json({ 
    extended: true, 
    limit: '10mb' 
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));
app.use(cookieParser());
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:5173',
}));
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/server', serverRoute);
app.use('/channel', channelRoute);
app.use('/friend', friendRoute);
app.use('/message', messageRoute);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB!');
});

module.exports = app;
