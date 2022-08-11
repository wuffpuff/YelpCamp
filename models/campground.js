const mongoose = require('mongoose');
const Schema = mongoose.Schema; //to shorten mongoose.Schema to just .Schema
const Review = require('./review.js')


const ImageSchema = new mongoose.Schema({ //separate schema is made for images to use virtuals on images, for thumbnail
    url:String,
    filename:String
});

//https://res.cloudinary.com/mundo2le/image/upload/v1659778504/YelpCamp/s0e1fgoaqbf27vbvezlq.jpg
ImageSchema.virtual('imageThumbnailForDeleteForm').get(function(){ //use 'imageThumbnailForDeleteForm' in <img src="<%=img.imageThumbnailForDeleteForm%>"
    return this.url.replace('/upload', '/upload/w_100') //replace /upload with /image/upload/w_100 in URL, Cloudinary API sees it and converts the image to w_100 for Thumbnail
})

//Mongoose does not include virtuals when you convert a document to JSON. You must "opts" and at the end of you Model, add " }, opts );"
const opts = {toJSON: {virtuals: true}}; //include virtuals when you convert a document to JSON

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: { //for getting location coordinates. This data schema is copied from https://mongoosejs.com/docs/geojson.html
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: { //"coordinates" is an array of numbers and it is required
          type: [Number],
          required: true
        }
      },
    price: Number,
    description: String,
    location: String, 
    author: 
        {
            type: mongoose.Schema.Types.ObjectId, //recognize author by its ID
            ref: 'User'
        },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, //store objects ID here
            ref: 'Review' //reference to 'Review' model
        }
    ]
}, opts); //opts - is for including virtuals in you model even though they are not stored in the database


//why "properties" is made and why as virtuals? Mapbox looks for properties field from a campground to get data for popup, therefore a campground needs to have "properties" field
//why as virtuals, you can embed "properties" into the model itself, but it is not that important. Why store it in the database, and store it as virtuals
//this "properties" below wont be stored in the database, it is just automatically made for you with virtuals, that's why we used virtuals instead of coding in the model
campgroundSchema.virtual('properties.popUpMarkup').get(function (){
    //when user click to a dot of a campground, below data of a campground pop-up, and a link to show page of that particular campground
    return `<strong> <a href="/campgrounds/${this._id}"> ${this.title}</a> <strong> <p> ${this.description.substring(0, 20)}...</p>`
    // description.substring(0, 20) - in case, description is long, only show from 0 to 20 characters max, then show 3 dots "..."
})








/*

//'findOneAndDelete' is only triggered by using 'findByIdAndDelete' in "app.delete" route
//this is comment - const campground = await Campground.findByIdAndDelete(id);
campgroundSchema.post('findOneAndDelete', async function(doc){
    //after doc is deleted (whatever is 'doc' maybe), and if there is anything left after 
    //deleting doc ('reviews remaining in this case') find them by their ID and delete them also
   if(doc){
        await Review.deleteMany({ //delete all reviews
            _id: { //where reviews ID field...
                $in: doc.reviews // is $in the doc.reviews array section
            }
        })
    }
})

*/

/*
this belows is a mongoose middleware to delete reviews, but not deleting individual reviews
this middleware is set to delete associated reviews to a campground. So,  when a campground
is deleted reviews posted on that campground  are also deleted along with it.
app.delete(campground) is placed in campground.js in "routes" file, and this mongoose middleware
is exported to that file. In harmony, when a campground is deleted,  so its reviews as well
*/
//without comments
campgroundSchema.post('findOneAndDelete', async function(doc){
   if(doc){
        await Review.deleteMany({
            _id: { 
                $in: doc.reviews 
            }
        })
    }
})

module.exports = mongoose.model('Campground', campgroundSchema);