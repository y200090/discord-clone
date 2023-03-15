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

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true, 
    origin: 'http://localhost:5173',
}));
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/server', serverRoute);
app.use('/channel', channelRoute);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB!');
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('Server is running!');
});
