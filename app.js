if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingRouter = require("./routes/listing.js"); 
const orderRouter = require("./routes/order.js"); 
const userRouter = require("./routes/user.js"); 

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

const sessionOptions={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const MONGO_URL = "mongodb://127.0.0.1:27017/E-Auction";

main()
.then(()=>{
    console.log("DB Connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get('/', (req, res) => {
    res.send("root api");
});

app.use((req, res, next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


//Data for testing purpose only
// app.get("/testlisting",async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Ford Endaviour",
//         description: "2nd hand car",
//         bidAmount: 2000000,
//         currentBid: 2500000,
//         highestBider: "abc@gmail.com",
//         expirationTime: 'feb 28, 2024 10:00:00',
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/orders", orderRouter);
app.use("/", userRouter);

//Error handler if "Page Not Found"
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page Not Found!"));
});

// custom error handling middleware
app.use((err, req, res, next)=>{
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./listings/error.ejs", {err});
});

app.listen(3000, ()=>{
    console.log("listening on port 3000");
});


