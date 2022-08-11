//You can't access some pages unless you are signed in.
/* In order to access you need to know if somebody is currently signed or if they are
authenticated. When you did your athentication from scratch,  you would store a user ID or
something similar in the session, just look for that. You could do it by yourself but...

But "passport" actually gives you a helper method "isAuthenticated()" as used below. It uses the
session, in other words, it stores its own stuff in there with the help of serialize & deserialize
passport.serializeUser(User.serializeUser());//how to store the session
passport.deserializeUser(User.deserializeUser());//how to unstore the session
That all has to do with how information is stored and retrieved from the session.



*/

const Campground = require("./models/campground");
const Review = require("./models/review");
const {campgroundSchema, reviewSchema} = require('./schemas');//for campgroundValidator
const ExpressError = require('./utilities/expressError');


//middleware that requires user to login for some pages
module.exports.isLoggedin = (req, res, next) => {  
    if(!req.isAuthenticated()){ //if user is NOT authenticated 

        //if user is stopped by the login or register requirement on any URL/path
        req.session.returnTo = req.originalUrl//save that user's path to the session for later use
        req.flash('error', 'You must be logged in!'); //flash this message
        return res.redirect('/login'); //redirect the user to login page
    }
    next(); //if user IS authenticated, let him access to those pages
}
//.isAuthenticated() method is coming from passport.local.mongoose



//middleware that requires only the author of a campground to edit his campground
module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params; //deconstruct ID from req.params
    const campground = await Campground.findById(id); //find a campground by its ID
    if(!campground.author.equals(req.user._id)){ //if 
        req.flash('error', 'Only Campground Author Can Make Changes');
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}


module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You are not Authorized for This Operation');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}



//campground NEW or EDIT validator
module.exports.campgroundValidator = (req, res, next)=>{
    const result = campgroundSchema.validate(req.body)//validate data comes from req.body
    const {error} = campgroundSchema.validate(req.body)//extract error from inputted data
    if(error){ //if error occurs...
        //map through error details, if error is numerous join them by comma and save in 'msg' var
        const msg=error.details.map(el=>el.message/*loop & for each el return message*/).join(',');
        throw new ExpressError(msg,400) //throw error, this error passes to 'app.use' error handler
    }
    //schema is defined, now data user enters passes through the campgroundSchema
    //validate data in req.body according to requirements set out in campgroundSchema
    else{ // IMPORTANT!!! after executing all the validation stuff above... move on
        next();//...move on to the next code
    }
}


//review NEW validator
//stops you to make empty review or review without rating etc
module.exports.reviewValidator = (req,res,next)=>{
    const result = reviewSchema.validate(req.body)
    const {error} = reviewSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg)
    } else {
        next();
    }
}