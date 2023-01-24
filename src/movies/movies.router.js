/* const router = require('express').Router({ mergeParams: true });
const controller = require('./movies.controller');
const methodNotAllowed = require('../errors/methodNotAllowed');
const readReviews = require('../reviews/reviews.controller');

router
    .route('/')
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route('/:movieId')
    .get(controller.read)
    .all(methodNotAllowed);

router
    .route('/:movieId/theaters')
    .get(controller.readTheaters)
    .all(methodNotAllowed);

router
    .route('/:movieId/reviews')
    .get(controller.readReviews)
    .all(methodNotAllowed);


module.exports = router; */

const router = require("express").Router();
const controller = require("./movies.controller");
const theatersRouter = require("../theaters/theaters.router");
const reviewsRouter = require("../reviews/reviews.router");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.use("/:movieId/theaters", controller.validateMovieId, theatersRouter);
router.use("/:movieId/reviews", controller.validateMovieId, reviewsRouter);

router
	.route("/")
	.get(controller.list)
	.all(methodNotAllowed);

router
	.route("/:movieId")
	.get(controller.read)
	.all(methodNotAllowed);

module.exports = router;
