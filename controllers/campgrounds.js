//Controller for Campground Routes
const Campground = require('../models/campground')//get Campground Model
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //for mapbox, when creating campground, take location, get its latitude and longtitude
const mapboxToken = process.env.MAPBOX_TOKEN; //pass the token from ".env" file. (the token itself is acquired from mapbox.com as an API key)
const geocoder = mbxGeocoding({accessToken: mapboxToken})//pass "MAPBOX_TOKEN" token through when you instantiate a new Mapbox geocoding instance
// this "geocoder" contains two methods "forwardGeocode" and "reverseGeocode" - coming from --- mbxGeocoding({accessToken: mapboxToken}) ---

const {cloudinary} = require('../cloudinary/index');//here this is required to delete images from cloudinary





//page shows all Campgrounds
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgroundFolder/index', { campgrounds })
};





//route to the page 'new' where the Submit form for creating new campground
module.exports.newCampForm = async (req, res) => {
    res.render('campgroundFolder/new')
};





//route for submitting the data you entered into the form to create new campground  
module.exports.createNewCamp = async (req, res, next) => { //creates new campground

    //GET THE COORDINATES using MAPBOX
    const geoData = await geocoder.forwardGeocode({ //call forwardGeocode using "geocoder" we have defined above. And it expects two thing minimum "query" and "limit"
        query: req.body.campground.location, //query takes the location that a user enters to the form
        limit:1 //one result
    }).send()//send the query after calling this function

    //STORE THE INFORMATION YOU GET BACK FROM MAPBOX "LONGTITUDE and LATITUDE" TO YOU CAMPGROUND MODEL
    const campground = new Campground(req.body.campground); //make a campgrounds according to the input a user entered to the from
    campground.geometry = geoData.body.features[0].geometry // then attach the location coordinates to the created campground's "geometry" field

    //MULTER, CLOUDINARY related
    //image upload function.
    campground.images = req.files.map(function (f) { //loop over the req.files, that is incoming data from the user in "new.ejs" <input type="file" name="image" id="" multiple>
        return {url: f.path, filename: f.filename}//and each time take "path" of the incoming file and place it to "url" field of campground, 
                                             //and each time take "filename" of the incoming file and place it to "filename" field of campground
    })


    //req.user is any user who is authenticated(loggedin)
    //req.user._id is an id of a loggedin user
    //req.user - comes from "passport"  passport.authenticate()
    campground.author = req.user._id;//associate a new campground to its submitter which is currently logged in user
    await campground.save(); // and save all the data to one complete campground in the database
    console.log(campground);//show what has been created
    req.flash('success', 'Succefully Place a New Campground'); //after creating a campground is successfully completed, flash this message, dont forget to specify "success"
    res.redirect(`campgrounds/${campground._id}`);// after creating campground is done, redirect the user to that newly created campground's show page
};





//details page for Campground
module.exports.showIndividualCamp = async (req, res) => {
    //we need the ID to look up the corresponding campground in database
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews', //firstly, populate 'reviews' 
        populate:{ //nested population
            path: 'author' //secondly, populate 'author' inside 'reviews'
        }
    }).populate('author')//display review
    console.log(campground)
    if(!campground){ //if user requests a campground which does not exist,  print error flash
        req.flash('error', 'Campground does not exist')
        return res.redirect('/campgrounds')//and redirect to the campgrounds page
    }
    res.render('campgroundFolder/show', { campground });
};

//route to the page 'edit' where it hosts the Submit form for editing existing data
module.exports.editCampForm =  async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgroundFolder/edit', { campground })
};





//route to find a data by its ID and Update it according to the input enter to the form
module.exports.editCamp =  async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    //save the incoming images from user request to "incomingImages" variable and push and...
    const incomingImages = req.files.map(function (f) {//loop over the req.files, that is incoming data from the user in "edit.ejs"
        return {url: f.path, filename: f.filename}//and each time take "path" of the incoming file and push it to "url" field 
                                             //and each time take "filename" of the incoming file and push it to "filename" field
    })
    
    // spread contents of incomingImages array variable with " ... " and push its relevant data/arguments, (namely 'url' and 'filename'  in this case), to the "campground.images" 
    campground.images.push(...incomingImages);//dont pass in data in an array form, spread the incomingImages array and push 'url' and 'filename' arguments to campground.images
    await campground.save()

    //delete requested image from edit form
    if (req.body.deleteImages) { //if request is made to delete an image = req.body.deleteImages = true, and if it is true...
        for (let filename of req.body.deleteImages){ //loop over every filename (inside req.body.deleteImages) that is requested to be deleted and...
            await cloudinary.uploader.destroy(filename); // delete every filename that is in the req.body.deleteImages from Cloudinary storage
        }

        //update campground data in the server after you delete images from Cloudinary
        await campground.updateOne({$pull:{images:{filename:{$in: req.body.deleteImages}}}})
        //pull elements out of and array "images" with the filename nothing but only matching with filenames that are $in: req.body.deleteImages
        //pull out of the "images" array, where the filename on each image is not exactly equal to something but equal to filenames that $in: req.body.deleteImages

    } //end of If conditional

    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};





//route to find a data by its ID and Delete it
module.exports.deleteCamp =  async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground')
    res.redirect('/campgrounds')
};

