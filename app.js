if(process.env.NODE_ENV !== "production"){//if you're not running your code in 'production' mode
    require('dotenv').config();//require 'dotenv' package (which is gonna take variables inside '.env') and
    //add them into process.env in the NODE app so you can access them in this file or another.
    //In production you dont actually do that
}

console.log(process.env.CLOUDINARY_CLOUD_NAME)



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utilities/expressError') //Express Class
const Joi = require('joi');//maybe this is only needed in schema.js file not here
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport'); //for crypting username and password login
const LocalStrategy = require('passport-local');////for crypting username and password login
const User = require('./models/user')

const MongoDBStore = require("connect-mongo"); //Using Mongo for session store

const registerRoutes = require('./routes/users');//require routes from "routes" folder
const campgroundRoutes = require('./routes/campground');//require routes from "routes" folder
const reviewRoutes = require('./routes/reviews');//require routes from "routes" folder

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp_camp'
mongoose.connect(dbUrl)
    .then(() => {
        console.log('Mongoose Connected on app.js')
    })
    .catch(err => {
        console.log('Mongoose Failed to Connect on app.js')
        console.log(err)
    })

const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }))//Express body parser  //parses request body
app.use(methodOverride('_method'));//for using POST,DELETE/PATCH etc requests
app.use(express.static(path.join(__dirname, 'public'))); //for diving code into their own files

const sessionSecret = process.env.SECRET || 'cookiepookie'

const store = MongoDBStore.create({
    mongoUrl: dbUrl,       //url key MUST BE "mongoUrl"  -  mongoUrl: yourDatabase
    secret: sessionSecret,
    touchAfter: 24 * 60 * 60  //if nothing is changed in the session, automatically update in every 24 hours, if something is changed, update that change at that time
});

const sessionConfig = {
    store,
    secret: sessionSecret,
    name: '_qmhe', //original name of a session "connect.sid" is easy for a hacker to spot that this is the session file he is looking for. So change the session file name
    resave: false,
    saveUninitialized: false, //read about it
    cookie:{
                    //1000mllscd, scnds, mnts, hrs, days
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//cookie expires after a week
        maxAge:  1000 * 60 * 60 * 24 * 7, //cookie expires after a week
        httpOnly: true//for security, cookie cant be accessed via client-side by third party
        //secure: true  //only use when website is deployed, in https routes you sessions wont work if secure:true
    }
}

//place this app.use(session()) midllwre before app.use(passport.session()), read pssprt.sessn()
app.use(session(sessionConfig));
app.use(flash());

//--------------------------------User authentication REGISTER

app.use(passport.initialize());//this middleware is required to initialize "Passport"
app.use(passport.session());//this middleware keeps a user logged in for a period of time
//to ensure login sessn is restord in crrct ordr, place passport.session() after app.use(session())

passport.use(new LocalStrategy(User.authenticate()))
// what it saying above is 'Hello Passport please use "LocalStrategy",
// and for this "LocalStrategy" the authentication method is located in our "User" model 
// and it call "authenticate". However, a method called "authenticate"  is not visible, 
// and it is one of several static methods that comes aut omatically from "passport-local-mongoose" 

// .serializeUser() and .deserializeUser() methods comes from "Passport-Local-Mongoose" package
passport.serializeUser(User.serializeUser());//how to store the session
passport.deserializeUser(User.deserializeUser());//how to unstore the session


//this middleware automatically pass through the flash message to your templates
//and this middleware specifically placed before the route handlers below
app.use((req,res,next) => {
    console.log(req.session) //- just to see the entire session 
    res.locals.signedUser = req.user;//get access to signed user data on any template
    res.locals.success = req.flash('success');//flash it if anything stored in .success
    res.locals.error = req.flash('error');//flash it if anything stored in .error
    next();
})

// app.get('/fakeuser', async(req, res) => {
//     const user = await new User({email:'letton@gmail.com', username:'celona'})//create new user
//     const registerUser = await User.register(user, 'chicken')//create a new user-instance
//     res.send(registerUser)
// })

app.use('/', registerRoutes)
app.use('/campgrounds', campgroundRoutes);//this is router //everything starts with /campgrounds
app.use('/campgrounds/:id/reviews', reviewRoutes);//starts with /campgrounds/:id/reviews


app.get('/', (req, res) => {
    res.render('home')
})

//call this callback for...
app.all('*', (req,res,next)=>{ //'all' = for every single request, '*' = for every path
    next(new ExpressError('Page Not Found', 404)) //pass a new express error to 'next()'
})

//because you pass the error in 'app.all' with next(), it is going to hit app.use
//and error will be that express error or it might be other that is comes from somewhere else
app.use((err, req, res, next) => { //error handler
    //default statusCode is 500
    const {statusCode = 500} = err //destructure form 'err';
    if(!err.message) err.message = 'Error Occurred'
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Serving On Port 3000')
})















