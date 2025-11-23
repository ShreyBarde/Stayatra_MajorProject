// Schema.js - defines Joi schemas for validating listing and review data,joi is a popular validation library used for data validation 
const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    price: Joi.number().required().min(0),

            // Allow either a direct image URL string (legacy) or an object like { url: string }
            // Forms now submit `listing[image][url]` so both shapes must be accepted.
            // Use Joi.alternatives to accept either a string or an object with url.
            image: Joi.alternatives().try(
                Joi.string().allow("", null),
                Joi.object({ url: Joi.string().allow("", null) })
            ),

    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),  
        comment: Joi.string().required()
    }).required()
})