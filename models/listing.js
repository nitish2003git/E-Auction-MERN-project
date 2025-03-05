const mongoose = require("mongoose");
const Order = require("./order.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type : String,
        required : true,
    },
    description : String,
    image : {
        url: String,
        filename: String,
    },
    bidAmount : Number,
    currentBid : Number,
    category : String,
    expirationTime : Date,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Order.deleteMany({_id: {$in: listing.orders}})
    }
});

const Listing=mongoose.model('Listing', listingSchema);
module.exports = Listing;