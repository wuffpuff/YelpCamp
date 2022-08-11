const Campground = require('../models/campground');
const Review = require('../models/review');


//post REVIEW route
//link your review to a specific campground defined by its ID
module.exports.createReview = async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;//review author is whoever is currently logged in
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Posted new review!')
    res.redirect(`/campgrounds/${campground._id}`)
    console.log(review)
};

// delete only a specific review
// "isReviewAuthor" - review author can delete only his review that he posted
module.exports.deleteReview = async(req,res)=>{
    //you dont wanna remove whole array of reviews through their ID
    //but rather you $pull the review you want to delete from the array of reviews
    //destructure campgroundId = id, and Id of a specific individual review =reviewId
    const {id, reviewId} = req.params
    await Campground.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    console.log(`${reviewId} Has Been Deleted`)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
};


// delete a campgrounds with its hundreds of reviews
// For that we defined 'mongoose middleware to delete' associated reviews in campground.js in 
// "models" folder and we already made "app.delete" route for deleting a campground in 
//  campgrounds.js in "routes" folder. So, Delete a campgrounds and its associated reviews will
//  be deleted with it automatically

// Remember here we dont delete reviews directly, We delete a campground with its associated reviews