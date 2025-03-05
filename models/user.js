const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    fname:{
        type: 'string',
    },
    lName:{
        type: 'string',
    },
    conPassword:{
        type: 'string',
    },
    email : {
        type: String,
        required: true,
    },
    allorders:[
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);