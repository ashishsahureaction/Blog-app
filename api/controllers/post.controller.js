import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';


export const create = async (req, res, next) => {
    console.log(req.user)
    if (!req.user.isAdmin) {
      return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content ) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title
      .split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
      ...req.body,
      slug,
      userId: req.user.id,
    });
    try {
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      next(error);
    }
  };


  export const getposts = async (req, res, next) => {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0; //getting post basis client url querry parameter
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;//asending order if querry paramter has order property

      const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),//spread 
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.searchTerm && {
          $or: [//or will serach between 2 title and content in mangodb
            { title: { $regex: req.query.searchTerm, $options: 'i' } },//regex is mangodb method for search with option i maesns lower or uppercase
            { content: { $regex: req.query.searchTerm, $options: 'i' } },
          ],
        }),
      })
        .sort({ updatedAt: sortDirection })//an object passed to the .sort() method to sort the documents based on the updatedAt field.
        .skip(startIndex)
        .limit(limit);
  
      const totalPosts = await Post.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(//Represents the date and time exactly one month ago from the current date.
        now.getFullYear(),
        now.getMonth() - 1,//subtracting 1 gives the previous month's index.
        now.getDate()
      );
  
      const lastMonthPosts = await Post.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({
        posts,
        totalPosts,
        lastMonthPosts,
      });
    } catch (error) {
      next(error);
    }
  };


  export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json('The post has been deleted');
    } catch (error) {
      next(error);
    }
  };

  export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
      return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            category: req.body.category,
            image: req.body.image,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  };
  

// .replace(/[^a-zA-Z0-9-]/g, ""): uses a regular expression to replace all characters that are not letters (uppercase and lowercase), 
// digits, or hyphens with an empty string.
// let name = "ASHISH kumar";
// let ram = name.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, ""); //"ashish-kumar"

// When a client makes an HTTP request to your Node.js server, the server creates a req object representing that request.
// The req object contains information about the request, such as the URL, query parameters, HTTP headers, HTTP method (GET, POST, etc.) and more.
//we can access like rq.url, req.querry,req.headers,req.method etc.
//When a client sends an HTTP request with a URL containing a query string (the part of a URL after the ? character), 
//the server can parse these query parameters.
//In Express.js, the req.query property is an object containing key-value pairs parsed from the query string of the request URL.
//example, with a URL like http://example.com/api/data?limit=10&page=2, req.query would be { limit: '10', page: '2' }.

//req.query.userId: retrieves the value of the userId query parameter from the HTTP request.
//&& { userId: req.query.userId }: This part creates an object { userId: req.query.userId } only if req.query.userId is truthy. 
//If req.query.userId is falsy, this expression evaluates to false and the subsequent spread syntax effectively removes it from the object.
//...: shallow copy using spread to create a new object by copying the properties of another object.
 //and it's used to conditionally add properties to the object being passed to Post.find().
//  getposts=async(req,res,next)=>{try{await Post.find({}).sort({}).skip().limit(); await Post.}}