//this file exports a function that wraps async route handlers to catch errors
module.exports = (fn) => {
    return (req, res, next) => {
        // Ensure fn's return value is wrapped as a Promise so synchronous
        // route handlers don't cause "Cannot read properties of undefined (reading 'catch')".
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};