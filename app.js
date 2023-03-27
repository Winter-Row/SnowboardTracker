var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//importing mongoose
var mongoose = require('mongoose');
//importing config file
var config = require('./config/global');
//importing user model
var User = require('./models/user');
//importing passport and sessions
const passport = require('passport');
const session = require('express-session');
//Importing github passport for github login
const githubStrategy = require('passport-github2').Strategy;
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var TripRouter = require('./routes/trips');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configure session
app.use(session({
  secret: 'snowboardTracker2023',
  resave: false,
  saveUninitialized: false
}));

//passport initialization
app.use(passport.initialize());//allows passport to be configured with strategies
app.use(passport.session());//handle session
//create and use local strategy
passport.use(User.createStrategy());

//github strategy
passport.use(new githubStrategy(
  {
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackUrl
  },
  async(accessToken, refreshToken, profile, done) => {
    //search user in my database
    const user = await User.findOne({ oauthId: profile.id});
    // if found do nothing just continue
    if(user){
      return done(null, user);
    }else{
      // if not then create a new user in my database
      const newUser = new User({
        username: profile.username,
        oauthId: profile.id,
        oauthProvider: 'GitHub',
        created: Date.now()
      });
      const savedUser = await newUser.save();
      return done(null, savedUser);
    }
  }
))

//configure user object serialization/deserialization
passport.serializeUser(User.serializeUser()); // serializeUser method comes from plm package
passport.deserializeUser(User.deserializeUser());

//routers
app.use('/', indexRouter);
app.use('/trips', TripRouter);


//setting up database connection
mongoose.connect(config.db,{ useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => { console.log('Connected Successfully'); })// successful connection
  .catch((error) => { console.log('Error: ' + error)});// error

hbs.registerHelper('toShortDate',(longDateValue)=>{
  return new hbs.SafeString(longDateValue.toLocaleDateString('en-CA'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
