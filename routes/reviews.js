const express =  require ('express')
const router = express.Router({mergeParams:true});
const catchAsync = require('../utilities/catchAsync')
const Campground = require('../models/campground.js')
const Review = require('../models/review.js')
const ExpressError = require('../utilities/expressError') //Express Class
const {reviewSchema} = require('../schemas')//only require reviewSchema, among many, from schemas.js 
const {isLoggedin, reviewValidator, isReviewAuthor} = require('../middleware');
const reviewsController = require('../controllers/reviews')



/*
REMINDER!!!
app.use('/campgrounds/:id/reviews', reviews; //everything starts with this route
because above we specified 'everything starts with /campgrounds/:id/reviews. There is no 
need to mention /campgrounds/:id/reviews in our path like:
old: /campgrounds/:id/reviews
new: /new

old: /campgrounds/:id/reviews
new: /

old: /campgrounds/:id/reviews/:reviewId
new: /:reviewId

*/

//post REVIEW route
//link your review to a specific campground defined by its ID
// "isLoggedin" for making sure a user post review only is he logged in
// "reviewValidator" for validating proper data inputted for review
// "catchAsync" for catching errors and handle them with express I think
router.post('/', isLoggedin, reviewValidator, catchAsync(reviewsController.createReview));

// delete only a specific review
// "isReviewAuthor" - review author can delete only his review that he posted
router.delete('/:reviewId', isLoggedin, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;

// delete a campgrounds with its hundreds of reviews
// For that we defined 'mongoose middleware to delete' associated reviews in campground.js in 
// "models" folder and we already made "app.delete" route for deleting a campground in 
//  campgrounds.js in "routes" folder. So, Delete a campgrounds and its associated reviews will
//  be deleted with it automatically

// Remember here we dont delete reviews directly, We delete a campground with its associated reviews
