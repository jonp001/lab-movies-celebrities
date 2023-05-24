const mongoose = require('mongoose')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const MongoStore = require('connect-mongo');


// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-movies-celebrities';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);


const celebritiesRoutes= require("./routes/celebrities.routes");
app.use("/celebrities/", celebritiesRoutes)

const moviesRoutes= require("./routes/movies.routes");
app.use("/movies", moviesRoutes)


const userRoutes = require("./routes/users.routes");
//remember to set this tp ("/")!! //
app.use("/", userRoutes)


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);



app.use(express.static('public'));
 
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
// body parser gives us access to req.body on post requests

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.set('trust proxy', 1);
 
  app.use(
    session({
      secret: "canBeAnything",
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000
      }, // ADDED code below !!!
      store: MongoStore.create({
        mongoUrl: 'mongodb://0.0.0.0:27017/lab-movies-celebrities'
 
        // ttl => time to live
        // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
      })
    })
  );


app.use((req, res, next)=>{
  res.locals.theUserObject = req.session.currentUser || null;
  next();
})



app.get("/", (req, res)=>{
    res.render("index");
})





module.exports = app;

