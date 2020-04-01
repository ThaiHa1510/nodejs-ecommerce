const express =require('express');
const env=require('dotenv').config();
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const reload=require('reload');
const jwt=require('jsonwebtoken');
const cart=require('./routes/web/cart');
const apiUser=require('./routes/api/userRoute');
const homeRoutes=require('./routes/web/home');
const passport =require('passport') 
const LocalStrategy = require('passport-local').Strategy;
var dbs= require('./db');
//const greetMiddleware=require('./routes/web/greet');
var config=require('./config');
var db=require('./models');
// middleware 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
const app=express();

//const mysql_db=db(process.env.HOST,process.env.DATABASE_PORT,process.env.DATABASE,process.env.DB_USER,process.env.DB_PASSWORD)
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret : "secret",
  saveUninitialized: true,
  resave: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(passport.initialize());
app.use(passport.session());
app.use(apiUser(db,app));
app.use(homeRoutes(db,app));
app.use(cart(db,app));
app.set('view engine','ejs');
app.set('views','views');
app.use(express.static('public'));

app.locals.siteTitle="THP website";
app.locals.siteTitle
passport.use(new LocalStrategy(
  function(username, password, cb) {
    db.User.findOne({
      where:{
          username:username,
      }
  }).then((result,err)=> {
      if (err) { return cb(err); }
      if (!result) { return cb(null, false); }
     // if (user.password != password) { return cb(null, false); }
      return cb(null, result);
    });
  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  dbs.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/page' }),
  function(req, res) {
    res.redirect('/');
  });
  app.get('/profile',
 // require('connect-ensure-login').ensureLoggedIn(),
 passport.authenticate('local', { failureRedirect: '/page' }),
  function(req, res){
    res.render('profile', { user: req.user });
  });

/*
class GreetingClass{
    constructor(greeting = 'Hello') {
        this.greeting = greeting;
        }
    setGreeting(name){
        return `thaihapro`;
    }
}
/* Middleware */

/**
app.use('/api/v1/service1',greetMiddleware({servire :  new GreetingClass('thaiha')}));

*/
var server=app.listen(process.env.PORT||3400,function (){
    console.log("Server started at:"+process.env.PORT);
   // console.log(config.database);
    

});

//reload(server,app);