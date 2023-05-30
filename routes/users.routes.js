const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require('bcryptjs');
const mongoose= require("mongoose");
const isLoggedIn = require('../utils/isLoggedIn');


router.get("/signup", (req, res, next) => {
    res.render("auth/signup")
});


router.post("/signup", (req, res, next) => {
    const numberOfRounds = 12;
    const username= req.body.username;
    const email= req.body.email;
    const password = req.body.password;

    bcryptjs
    .genSalt(numberOfRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {

        User.create({username:username, password: hashedPassword, email: email})
        .then(() =>{
            req.flash("success", "Sign-up was Successful!")
            res.redirect("/")
        })
    .catch(error => {
        if(error instanceof mongoose.Error) {
            req.flash("error", error.message);
            res.redirect("/signup");
        }
    })
})

.catch((error) => next(error))
})


router.get("/login", (req, res) => {
    res.render("auth/login")
});

router.post("/login", (req, res, next) => {
    const username= req.body.username;
    const password= req.body.password;
    
    console.log("current session...", req.session);
 
    User.findOne({ username: req.body.username})
    .then(foundUser => {
        if(!foundUser) {
            req.flash(" No User Found");
            //will add package for error later
            res.redirect("/login");
            return;


        } else if( bcryptjs.compareSync(req.body.password, foundUser.password)) {
            // SAVE THE USER IN THE SESSION //
            req.session.currentUser= foundUser;
            req.flash("success", "Successfully logged in")
            res.redirect("/");
        } else {
            req.flash("error", "Sorry, Password Does Not Match");
            res.redirect("/login");
        }
    })
    .catch(error => next(error))
})

router.post("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
});

router.get("/user-profile", isLoggedIn, (req, res, next) => {
    User.findById(req.session.currentUser._id).populate("movie")
    .then((theUser) => {
        res.render("auth/profile", {theUser: theUser})
    })
})

module.exports = router;