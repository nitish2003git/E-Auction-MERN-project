const Listing = require("../models/listing");
const Order = require("../models/order");
const Category = require("../models/category");

module.exports.index = async (req, res) => {
    if(req.query.CATEGORY === undefined || req.query.CATEGORY == 'All items'){
        const allListings = await  Listing.find({});
        const allCategories = await  Category.find({});
        let mainCategory = allCategories[0];
        res.render("./listings/index.ejs", {allListings, mainCategory});
    }else{
    console.log(req.query.CATEGORY);
    const allListings = await  Listing.find({ category:  req.query.CATEGORY});
    const allCategories = await  Category.find({});
    let mainCategory = allCategories[0];
    res.render("./listings/index.ejs", {allListings, mainCategory});
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing= async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "orders", populate: {path: "orderby"},});
    const person1 = listing.orders[listing.orders.length-1];
    const person2 = listing.orders[listing.orders.length-2];
    const person3 = listing.orders[listing.orders.length-3];
    
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {listing ,person1, person2, person3});
};

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing){
        throw new ExpressError(400, "Bad Request");
    }
    // let {title, description, image, bidAmount, expirationTime} = req.body;
    // let listing = new Listing({
    //     title: title,
    //     description: description,
    //     image: image,
    //     bidAmount: bidAmount,
    //     expirationTime: expirationTime,
    // });
    // await listing.save();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url,filename};
    let newtype = newListing.category;

    const allCategories = await  Category.find({});

    if(allCategories[0].type.includes(newtype)){
        console.log("category is already present");
    }else{
        allCategories[0].type.push(newtype);
    }
    await allCategories[0].save();
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm= async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    if (!req.body.listing){
        throw new ExpressError(400, "Bad Request");
    }
    let {id} = req.params;
    const listing = await Listing.findById(id);
    const updatedData = { ...req.body.listing };
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedData.image = { url, filename };
    } else {
        // Retain the previous image if no new image is uploaded
        updatedData.image = listing.image;
    }
    await Listing.findByIdAndUpdate(id, updatedData);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Dleted!");
    res.redirect("/listings");
};


module.exports.aboutus = (req, res) => {
    res.render("./listings/aboutUs.ejs");
};

module.exports.checkAllOrders =  async(req, res) => {
    const allOrders = await  Order.find({}) .populate('orderby').populate('orderon');
    res.render("./listings/checkAllOrders.ejs", {allOrders});
};

