const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users");

router.route("/").get
router.route("/signup")
.get(// render signup form
   userController.renderSignupForm
 )
 .post( // handle signup
    userController.handleSignup
);





router.route("/login")
.get(// render login form
    userController.renderLoginForm
)
.post(//handle login
    saveRedirectUrl, passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
}), 
    userController.handleLogin
);



// handle logout
router.route("/logout")
.get(
    userController.handleLogout
);





module.exports = router;