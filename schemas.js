//require Joi first 
//Important!!! Dont confuse it with Mongoose Schema, it just a Schema to validate data that is actually going to Mongoose. So this Joi Schema validates data coming from client side before entering to database.  
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html') // installed (npm install sanitize-html)  only for Joi


//Prevent a user to embed html or <script> through an input to the client-side of you app
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': 'prohibited syntax is detected at {{#label}}'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml (value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
})

//Joi equals old version which the 'BaseJoi' but extended with above extension which gives you the possibility of using "escapeHtml"
const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground:Joi.object({//key is 'campground', campground[something] and object is expected,
        title:Joi.string().required().escapeHTML(), //pass in that 'something' campground[price]
        price:Joi.number().required().min(0),//min price is 0, user cant enter negative number 
        // image:Joi.string().required(),
        location:Joi.string().required().escapeHTML(),
        description:Joi.string().required()
    }).required(),//all of the above is required. Data not validated if anyone above is missing
    deleteImages:Joi.array()//deleted images can be numerous, therefore it is an array, and an array holds multiple objects inside
});

module.exports.reviewSchema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required().escapeHTML()
    }).required()//whole thing to be required... don't miss this 
})