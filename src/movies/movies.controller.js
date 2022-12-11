const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary"); //import error boundary

async function movieExists(req, res, next) {  //function to check in particular movieId exists
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({
    status: 404,
    message: "Movie cannot be found.",
  });
}

async function list(req, res) {
  const isShowing = req.query;
  if (isShowing) {
    const showList = await service.isShowing();
    res.json({ data: showList });
  } else {
    res.json({ data: await service.list() });
  }
}

async function read(req, res) {
  res.json({ data: res.locals.movie });
}

async function readTheaters(req, res) { //for movies/:movieId/theaters
  const { movieId } = req.params;
  res.json({ data: await service.readTheaters(movieId) });
}

async function readReviews(req, res) { //for movies/:movieId/reviews
  const { movieId } = req.params;
  res.json({ data: await service.readReviews(movieId) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [asyncErrorBoundary(movieExists), readTheaters],
  readReviews,
};