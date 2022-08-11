const cloudinary = require('cloudinary').v2;

//multer-storage-cloudinary makes the process of uploading files, which are getting
//parsed by "multer", to "cloudinary" storage smooth.
const {CloudinaryStorage} = require('multer-storage-cloudinary');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

//STORAGE  - instantiate an instance of cloudinary storage, which you import from - const {CloudinaryStorage} = require('multer-storage-cloudinary');
  const storage = new CloudinaryStorage({ //make instance of CloudinaryStorage, and pass that through to - const upload = multer({storage}); in routes/campgrounds.js file
    cloudinary, //cloudinary object that you specified above
    params:{
        folder:'YelpCamp', //this creates 'YelpCamp' folder that will be in cloudinary.com that you store uploaded files in
        allowedFormats:['jpeg', 'jpg', 'png', 'bmp']
      }
  });

  module.exports = {
    cloudinary,
    storage
  }

/*
1) You start by setting up your 'multipart form data' form. And then unfortunately you cannot 
parse the body the regular way you have been doing.

new.ejs
<form action="/campgrounds" method="post" novalidate class="validated-form" enctype="multipart/form-data">


2) So then you need to make sure that you use "MULTER" package which plays well with "Cloudinary"

campground.js - routes
const multer = require('multer');
const {storage} = require('../cloudinary/index');//storage you set up in ../cloudinary/index
const upload = multer({storage});//store whatever file comes from req.body in "storage"

3) You pass that form information, you send that on up to Cloudinary which then you get back image URLs
back, those URLs as well as other information about each upload is going to be added on to a particular
property on the request object called "req.file" (for single file upload,  "req.files" for plural file upload),
which then you will have access to

4) And you will be able to take information from "req.file or req.files" and use it to update you particular 
model instance and save that instance as a campground object

campground.js - controllers
campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))




5) And then in your template you have access to "url" and "filename" for each image and you just render the URL
to show the image.

show.ejs
<% for(let loopedImg of campground.images) { %> <!--loop over "images" field of "campground" object-->
<img src="<%=loopedImg.url%>"  class="card-img-top" alt="..."> <!-- image source is the "url" of each looped image-->
<% } %>  
*/