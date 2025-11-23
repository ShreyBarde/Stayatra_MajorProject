const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

// ============================================
// SIGNUP
// ============================================

// Render signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup");
};

// Handle signup
module.exports.handleSignup = wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        
        // Log in the newly registered user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            
            req.flash("success", "Welcome! Your account has been created.");
            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl; // Clean up
            return res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
});

// ============================================
// LOGIN
// ============================================

// Render login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

// Handle login (called AFTER passport.authenticate succeeds)
module.exports.handleLogin = (req, res) => {
    req.flash("success", "Welcome back!");
    
    // Get redirect URL from res.locals (set by middleware) or default to /listings
    const redirectUrl = res.locals.redirectUrl || "/listings";
    
    // Clean up session
    delete req.session.redirectUrl;
    
    return res.redirect(redirectUrl);
};

// ============================================
// LOGOUT
// ============================================

// Handle logout
module.exports.handleLogout = (req, res, next) => {
    req.logout((err) => {  
        if (err) {
            return next(err);
        }
        
        // Clean up session
        delete req.session.redirectUrl;
        
        req.flash("success", "You have been logged out.");
        return res.redirect("/listings");
    });
};