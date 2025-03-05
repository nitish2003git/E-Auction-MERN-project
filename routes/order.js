const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Order = require("../models/order.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const {isLoggedIn} = require("../middleware.js");

const orderController = require("../controllers/orders.js");

//Order
// POST route
router.post("/",isLoggedIn, wrapAsync(orderController.createOrder));


//get route for payment form
router.get("/payment",isLoggedIn, orderController.createPayment);



module.exports = router;
