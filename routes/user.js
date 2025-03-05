const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

const userController = require("../controllers/users.js");

//GET route - to render signup form 
router.get("/signup", userController.renderSignupForm);

//POST route - to add user in db  
router.post("/signup", wrapAsync(userController.signup));

//GET route - to render login form 
router.get("/login", userController.renderLoginForm);

//Post route - to authenticate the user
router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    wrapAsync(userController.login));

// Logout route
router.get("/logout", userController.logout);

//your orders route
router.get("/:id/yourOrders", wrapAsync(userController.yourOrders));


module.exports = router;