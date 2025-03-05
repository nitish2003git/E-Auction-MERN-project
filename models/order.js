const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    amount: Number,
    createdAt: {
        type: Date,
        default: () => Date.now(),
    },
    orderby:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    orderon:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
    }
});

module.exports = mongoose.model("Order", orderSchema);