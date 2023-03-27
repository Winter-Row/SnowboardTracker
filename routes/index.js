var express = require('express');
var router = express.Router();

//import User
const User = require('../models/user');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Snowboard Trip Tracker', user: req.user });
});

/* GET login page */
router.get('/login', function(req, res, next) {
  let messages = req.session.messages || []; 
  req.session.messages = []; 
  res.render('login', { title: 'Login', messages: messages });
});

// POST /login
router.post('/login',passport.authenticate('local', {
  successRedirect: '/trips',
  failureRedirect: '/login',
  failureMessage: 'Invalid Credentials'
}));

/* GET Register page */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register a new account' });
});

// POST /register
router.post('/register',(req,res,next)=>{
  User.register(
    new User({
      username: req.body.userName
    }),
    req.body.password,
    (err, newUser) =>{
      if(err){
        console.log(err);
        res.redirect('/register');
      }else{
        req.login(newUser, (err) => {res.redirect('/login');});
      }
    }
  );
});

//GET /logout
router.get('/logout',(req,res,next)=>{
  req.logout(function(err){
    res.redirect('/login');// user gets logged out, session is cleared, and user is redirected to login
  });
});

//GET /github
router.get('/github',passport.authenticate('github', { scope: ['user.email']}));

//GET /github/callback
router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login'}),//unsuccessful login
  (req, res, next) =>{
    res.redirect('/trips');//successful login
  }
)

module.exports = router;
