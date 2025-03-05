const User = require("../models/user");

module.exports.renderSignupForm= (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup= async (req, res)=>{
    try{
     let {firstName,lastName ,username , email , password} = req.body;
     const newUser = new User({firstName,lastName,username, email});
     const registeredUser = await User.register(newUser, password);
     
     req.login(registeredUser, (err)=>{
         if (err) {
             return next(err);
         }
           req.flash('success', "Welcome to BidZone!");
           res.redirect("/listings");
     });
    } catch(e){
     req.flash("error", e.message);
     res.redirect("/signup");
    }
 };

 module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    if(req.user._id == '6620dee15d1f7a336b04823a'){
        req.flash('success', "Now you logged in as ADMIN");
        res.redirect("/listings");
    } else{
        req.flash("success","Welcome to BidZone, You are logged in!");
        res.redirect("/listings");
    }
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are now logged out!");
        res.redirect("/listings");
    });
};

module.exports.yourOrders = async(req, res)=>{
    let {id} = req.params;
    const user = await User.findById(id).populate({path: "allorders", populate: [{path: 'orderby', model: 'User'},{path: 'orderon', model: 'Listing'}]});
    console.log(user);
    res.render("users/yourOrders.ejs", {user} );
};