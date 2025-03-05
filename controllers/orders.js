const Listing = require("../models/listing");
const Order = require("../models/order");
const User = require("../models/user");


module.exports.createOrder = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newOrder = new Order(req.body.order);
    newOrder.orderby=req.user._id;
    newOrder.orderon=listing._id;

    let currentBid = newOrder.amount;
    listing.orders.push(newOrder);
    listing.currentBid = currentBid;

    let user = await User.findById(req.user._id).populate("allorders");
    user.allorders.push(newOrder);
    console.log(user);

    await newOrder.save();
    await listing.save();
    await user.save();
    
    req.flash("success", "Bid placed successfully, the amount will be deducted at the end of the auction if you win.");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.createPayment = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    res.render("users/payment.ejs",{listing});
};