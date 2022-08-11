/*
We made this file self-contained, so it is going to connect to mongoose
and use my Model. We wil run this file on its own separately from our node
at any time we want to seed out database which is not that often anytime
we make changes to the Model or the data
*/

const mongoose = require('mongoose');
const cities = require('./cities');//to access for data on cities
const Campground = require('../models/campground.js');//pay attention to path
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp_camp')
    .then(() => {
        console.log('Mongoose Connected on index.js')
    })
    .catch(err => {
        console.log('Mongoose Failed to Connect on index.js')
        console.log(err)
    });

//pick a random number multiplied by the length of the array, floor that and access
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) { //loop 50 times
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10; //generate random price
        const camp = new Campground({
            author: '62d93405f5da19ede9119ea5',//user ID that creates campground, it is HARD-CODED, it should be generic
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi, expedita. Voluptatem quos repudiandae similique. Molestiae sint velit, reprehenderit alias quidem impedit animi non est dolores delectus quia culpa, magnam facere?',
            price,
            geometry:{
                type: "Point",
                coordinates: [
                    //longitude comes first and then latitude
                    cities[random1000].longitude, //grab longitude of a looped cities.   it is like - cities[i] in place of random1000
                    cities[random1000].latitude,  //grab latitude of a looped cities 
                ]
            },
            images:  [
                {
                    //No _id is needed, it will be added for you
                  url: 'https://res.cloudinary.com/mundo2le/image/upload/v1659712278/YelpCamp/hkphdldv5zc28hbhvdd7.webp',
                  filename: 'YelpCamp/hkphdldv5zc28hbhvdd7',
                }
              ]
        })
        await camp.save();
    }
}
seedDB() //execute seedDB async function
    .then(() => { //seedDB returns a promise as it is async function
        mongoose.connection.close() //that how we close
    })