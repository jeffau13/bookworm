var express = require('express');
var router = express.Router();
const User = require('../models/user');

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

// GET /register
router.get('/register', (req,res,next)=>{

  res.render('register', {title: 'Register'});
});

// POST /register
router.post('/register', (req,res,next)=>{
  //Error checking
  if(req.body.email && req.body.name && req.body.favoriteBook &&
    req.body.password && req.body.confirmPassword){
      //confirm that passwords are identical:

      if(req.body.password !== req.body.confirmPassword){
        const err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }
    //create user object to hold data to be inserted:
      const userData={
        email: req.body.email,
        name: req.body.name,
        favoriteBook: req.body.favoriteBook,
        password: req.body.password

      };
    // insert data into mongo:
    User.create(userData,(error,user)=>{
      if(error){
        return next(error);
      }else{
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });

    }else{
      const err = new Error('All fields are required.');
      err.status = 400;
      return next(err);
    }
});

// GET /login
router.get('/login', (req,res,next)=>{
  res.render('login', {title: 'Login'})
});

//POST /login
router.post('/login', (req,res,next)=>{
  if(req.body.email && req.body.password){
    User.authenticate(req.body.email,req.body.password, function(error,user){
      if (error||!user){
        const err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }else{
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  }else{
    const err = new Error('Email and password are required!');
    err.status=400;
    return next(err);
  }
});   

// GET /profile
router.get('/profile', (req,res,next)=>{
  if(! req.session.userId){
    const err = new Error('You are not authorized to view this page');
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec((error,user)=>{
      if (error){
        return next(error);
      }else{
        return res.render('profile', {title: 'Profile',name: user.name, favorite: user.favoriteBook});
      }
    });
});

module.exports = router;
