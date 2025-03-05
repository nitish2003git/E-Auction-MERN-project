const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

   // About Us Page route
        router.get("/aboutUs", listingController.aboutus);

//index route -> to show all listings
router.get("/", wrapAsync(listingController.index));

// new route -> render a form (new.ejs)
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create route 
router.post("/",isLoggedIn,upload.single("listing[image]"), wrapAsync(listingController.createListing));

//Show route -> to view particular listing
router.get("/:id", wrapAsync(listingController.showListing));

// edit route -> render a edit form for a specific listing
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.renderEditForm));

// update route
router.put("/:id",isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.updateListing));

// Delete route
router.delete("/:id",isLoggedIn, wrapAsync(listingController.destroyListing));

//Check all orders route 
router.get("/admin/checkAllOrders", isLoggedIn, wrapAsync(listingController.checkAllOrders));

//category route
router.post("/categories", wrapAsync(listingController.category));

module.exports = router;