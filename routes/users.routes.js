const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcryptjs = require('bcryptjs');


router.get("/signup", (req, res, next) => {
    res.render("auth/signup")
});


router.post("/signup", (req, res, next) => {
    const numberOfRounds = 12;
    const username= req.body.username;
    
    const password = req.body.password;

    bcryptjs
    .genSalt(numberOfRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {

        User.create({username:username, passwordHash: hashedPassword})
        .then(() =>{
            res.redirect("/")
        })
    })
    .catch(error => console.log(error))
});

router.get("/login", (req, res) => {
    res.render("auth/login")
});

router.post("/login", (req, res, next) => {
    const username= req.body.username;
    const password= req.body.password;
    console.log("current session...", req.session);
 
    User.findOne({ username: username})
    .then(foundUser => {
        if(!foundUser) {
            console.log(" No User Found");
            //will add package for error later
            res.redirect("/");
            return;
        } else if( bcryptjs.compareSync(password, foundUser.passwordHash)) {
            // SAVE THE USER IN THE SESSION //
            req.session.currentUser= foundUser;
            res.redirect("/");
        } else {
            console.log("Sorry, Passwords DO NOT MATCH");
            res.redirect("/");
        }
    })
    .catch(error => next(error))
})

router.post("/logout", (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
})

module.exports = router;