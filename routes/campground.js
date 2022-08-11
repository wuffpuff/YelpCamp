const express =  require ('express')
const router = express.Router();//if problem try express.Router({mergeParams:true});

const catchAsync = require('../utilities/catchAsync')
const ExpressError = require('../utilities/expressError') //Express Class
const Campground = require('../models/campground.js')//get Campground Model
const campgroundsController = require('../controllers/campgrounds')//get campground function
const {isLoggedin, isAuthor, campgroundValidator} = require('../middleware');
const { route } = require('./users');

const multer = require('multer');
const {storage} = require('../cloudinary/index');//storage you set up in ../cloudinary/index
const upload = multer({storage});//store whatever file comes from req.body in "storage"

//Multer adds a (body object) and a (file or files object) to the request object. 
//The body object contains the values of the text fields of the form, 
//the file or files object contains the files uploaded via the form.

/*
now, with "multer" package, you have access to 2 middlewares. See below:
1) upload single image
app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
  })

2) upload multiple image
  app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
  })

If you use this middleware and a user uploads an image, 'multer' starts to do its job
which is it parses the form information and stores the file or files on req.file or req.files
and then any other information from the form on req.body
*/



/*
REMINDER!!!
app.use('/campgrounds', campgrounds);//this is router //everything starts with /campgrounds
because above we specified 'everything starts with /campgrounds. There is no need to mention
/campgrounds in our path like:
old: /campgrounds/new
new: /new

old: /campgrounds/:id/edit
new: /:id/edit
*/


//isLoggedin - checks if a user logged in to  make a particular move
//isAuthor - checks if a user is the author of a campground or review to edit or delete them

//page shows all Campgrounds
router.get('/', catchAsync (campgroundsController.index));

//route to the page 'new' where the Submit form for creating new campground
router.get('/new', isLoggedin, catchAsync(campgroundsController.newCampForm));//page including form for adding new campground 

//route for submitting the data you entered into the form to create new campground  
router.post('/', isLoggedin, upload.array('image'), campgroundValidator, catchAsync(campgroundsController.createNewCamp))


//details page for Campground
router.get('/:id', catchAsync(campgroundsController.showIndividualCamp));

//route to the page 'edit' where it hosts the Submit form for editing existing data
router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campgroundsController.editCampForm))

//route to find a data by its ID and Update it according to the input enter to the form
router.put('/:id', isLoggedin, isAuthor, upload.array('image'), campgroundValidator, catchAsync(campgroundsController.editCamp))


//route to find a data by its ID and Delete it
router.delete('/:id', isLoggedin, isAuthor, catchAsync(campgroundsController.deleteCamp))

module.exports = router;