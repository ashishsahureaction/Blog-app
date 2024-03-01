import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import userAuth from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';


dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {console.log('Server is running on port 3000!!!');});
  

app.use('/api/user', userRoutes);
app.use('/api/auth', userAuth);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

app.use((err, req, res, next) => {//it is a middleware to handle error and next for next
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});


//app.get('/test', (req, res) => { res.json({message:'Api is working'})});//to check server api is working http://localhost:3000/test 
//best practise to put all backend api in seprate folder/files like routes folder.
//request is the data what we send to api and response what we recived from server

//app.use((err, req, res, next) -middleware for handling errors in an Express.js, it will be executed whenever an error occurs during the processing of a request.

//app.use: method used to mount the middleware function in the Express app, specifies that this middleware should be executed for every incoming request.
//(err, req, res, next): This is the signature of the middleware function. It takes four parameters://error,req,res object and next fn,
//const statusCode = err.statusCode || 500;: It sets the HTTP status code for the response. If the error object has a statusCode property,
// it uses that value; otherwise, it defaults to 500 (Internal Server Error)
