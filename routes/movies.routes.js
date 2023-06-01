// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("../models/Celebrity.model");
const Movie= require("../models/Movie.model");
const User= require("../models/User");
const isLoggedIn= require("../utils/isLoggedIn");

// Render the create movie form
router.get("/create", (req, res, next) => {
    Celebrity.find()
        .then((celebrities) => {
            res.render("./movies/new-movie", { celebrities });
        })
        .catch(error => next (error));
});

// Handle the create movie form submission
router.post("/create", (req, res, next) => {
    const {title, genre, plot} = req.body;
    const cast = req.body.celebrity;
    const newMovieInfo= {title, genre, plot, cast};
   
    Movie.create(newMovieInfo)
        .then((response) => {
            req.flash("success", "Movie was Successfully Created");
            res.redirect("/movies");
        })
        .catch(error => next (error));
});

// Show the list of movies
router.get("/", (req, res, next) => {
    Movie.find()
        .then((movies) => {
            res.render("./movies/movies", { movies });
        })
        .catch(error => next(error));
});

// Render the edit movie form
router.get("/:movieId/edit", (req, res, next) => {
    let movieId= req.params.movieId;
    let editData= {};
    Movie.findById(movieId) 
        .then((movieDetails) => {
            editData.movie= movieDetails;
            return Celebrity.find();
        })
        .then((celebrities) =>{
            editData.celebrities= celebrities;
            res.render("./movies/edit-movie", editData);
        })
        .catch(error => next(error));
});

// Handle the edit movie form submission
router.post("/:movieId/edit", (req, res, next) => {
    const movieId= req.params.movieId;
    const updatedMovie= req.body;
    Movie.findByIdAndUpdate(movieId, updatedMovie)
        .then(() => {
            req.flash("success", "Movie updated successfully")
            res.redirect(`/movies/${movieId}`);
        })
        .catch(error => next(error));
});

// Show a single movie detail
router.get("/:movieId", (req, res, next) => {
    let movieId= req.params.movieId;
    Movie.findById(movieId)
        .populate("cast")
        .then((movie) => {
            res.render("./movies/movie-detail", {movie: movie}); // remember to add {movie: movie} here to populate movie details!!
        })
        .catch(error => next(error));
});

// Handle the delete movie request
router.post("/:id/delete", (req, res, next) => {
    let movieId= req.params.id;
    console.log("Movie ID:", movieId);
    Movie.findByIdAndDelete(movieId)
        .then(() => {
            req.flash("success", "Movie deleted successfully")
            res.redirect("/movies");
        })
        .catch(error => next(error));
});

router.post("/add/:id", isLoggedIn, (req, res, next) => {
    let movieId= req.params.id;
    Movie.findById(movieId)
    .then((theMovie) => {
        const userId= req.session.currentUser._id;
        User.findByIdAndUpdate(userId, {
            $push: {movie: theMovie._id}
        })
        .then(() => {
            Movie.findByIdAndUpdate(movieId, {added: true})
            .then(() => {
                req.flash("success, Movie added successfully")
                res.redirect("/movies");
            })
        })
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

module.exports = router;