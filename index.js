const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const fileUpload = require('express-fileupload');

const app = express();

require('dotenv').config({
    path: './config/config.env',
});

console.log('------------------------------------Node Task Assigment-------------------------------')
console.log('------------------------------------Author: Cicada 3301-------------------------------')
console.log('------------------------------------Dated: 21-10-2022-------------------------------')

app.use(express.json());

// parse json request body
app.use(bodyParser.json({ limit: '10mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB();

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: '/tmp/',
    })
);

const authRouter = require('./routes/auth.route');
const postRouter = require('./routes/post.route')

app.use('/api/', authRouter);
app.use('/api/', postRouter);
app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Page Not Found',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.info("Server running at port", PORT));