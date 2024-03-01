import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {const { username, email, password } = req.body; //body of an HTTP request

if(!username || !email || !password || username==="" || email==="" || password===""){
    next(errorHandler(400, 'All fields are required'));;
}

const hashedPassword = bcryptjs.hashSync(password, 10);

const newUser = new User({
    username,
    email,
    password:hashedPassword
  });


    await newUser.save();
    res.json('Signup successful');
    try {
        await newUser.save();
        res.json('Signup successful');
      } catch (error) { next(error);}
   }


  export const signin = async (req, res, next) => { const { email, password } = req.body;
  
    if (!email || !password || email === '' || password === '') {
      next(errorHandler(400, 'All fields are required'));
    }
  
    try {
      const validUser = await User.findOne({ email });
      if (!validUser) {
        return next(errorHandler(404, 'User not found'));
      }
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }
      
      const token = jwt.sign( { id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

      const { password: pass, ...rest } = validUser._doc;
  
  
  
      res.status(200).cookie('access_token', token, {httpOnly: true,})
        .json(rest);
    } catch (error) {
      next(error);
    }
  };
  
  export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user) {//if user is true or there
        const token = jwt.sign(
          { id: user._id,  isAdmin: user.isAdmin },
          process.env.JWT_SECRET
        );
        const { password, ...rest } = user._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);//gmwcn8xs2cum3kb4
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        const newUser = new User({
          username:
            name.toLowerCase().split(' ').join('') +
            Math.random().toString(9).slice(-4),//ashish8526 lowercase-string to array-string- plus+  random number-string-toString(9) for round off-cut 4 number
          email,
          password: hashedPassword,
          profilePicture: googlePhotoUrl,
        });
        await newUser.save();
        const token = jwt.sign(
          { id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWT_SECRET);
        const { password, ...rest } = newUser._doc;
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      }
    } catch (error) {
      next(error);
    }
  
  }



//destrured all the post value 
//if no usrename, and no email,and no password and username===empty string etc.. return error or responce with status code 400 and message. 
//and putting all the extracted values in User Model created with the help of mangoose schema to store in DB as key value pair.
//Once after get the user daetisl we ahve save them in DB.
//created new object of User model with new oprator and injected all the values to schema store in DB

//validUser: This is an object representing a user, and it has a property _doc. in mangodb where data is stored inside the _doc property.
//{ password: pass, ...rest }: This is an object destructuring syntax. It's extracting the password property from validUser._doc 
//and renaming it to pass. The remaining properties of validUser._doc are collected into the rest variable.

//toString(36) method is often used to convert a number to its base-36 representation
//const number = 123;
// const base36String = number.toString(36);
// console.log(base36String); // Output: '3f