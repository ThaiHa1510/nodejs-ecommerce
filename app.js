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

// Connect Redis 
const {RedisClient,AsyncgetValue,AsyncsetValue}=require('./db/redis');
var dbs= require('./db');


var config=require('./config');
var db=require('./models');
// middleware 
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
const app=express();


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret : "secret",
  saveUninitialized: true,
  resave: true
}));

app.use(express.json());  
app.use(express.urlencoded());
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
  async function(req, res){
    let x= await AsyncgetValue("thaiha");
    
    res.send(x);
  });

var server=app.listen(process.env.PORT||3400,function (){
    console.log("Server started at:"+process.env.PORT);
   // console.log(config.database);
    

});

//reload(server,app);