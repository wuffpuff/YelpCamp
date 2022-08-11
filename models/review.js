const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({ //create a schema for review
    body:String,
    rating:Number,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
})

module.exports =  mongoose.model('Review', reviewSchema); //export 'Review' Model
