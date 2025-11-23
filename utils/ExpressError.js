// utils folder contains utility classes and functions used across the application

//this file defines a custom error class for handling Express errors
class ExpressError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode || 500;
        this.message = message;
    }
}


module.exports = ExpressError;
