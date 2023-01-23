const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://backend-module-43.onrender.com";

const headers = new Headers();
headers.append("Content-Type", "application/json");


async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

function populateReviews(signal) {
  return async (movie) => {
    const url = `${API_BASE_URL}/movies/${movie.movie_id}/reviews`;
    movie.reviews = await fetchJson(url, { headers, signal }, []);
    return movie;
  };
}

function populateTheaters(signal) {
  return async (movie) => {
    const url = `${API_BASE_URL}/movies/${movie.movie_id}/theaters`;
    movie.theaters = await fetchJson(url, { headers, signal }, []);
    return movie;
  };
}


export async function listMovies(signal) {
  const url = new URL(`${API_BASE_URL}/movies?is_showing=true`);
  const addReviews = populateReviews(signal);
  return await fetchJson(url, { headers, signal }, []).then((movies) =>
    Promise.all(movies.map(addReviews))
  );
}

export async function listTheaters(signal) {
  const url = new URL(`${API_BASE_URL}/theaters`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function readMovie(movieId, signal) {
  const url = new URL(`${API_BASE_URL}/movies/${movieId}`);
  const addReviews = populateReviews(signal);
  const addTheaters = populateTheaters(signal);
  return await fetchJson(url, { headers, signal }, [])
    .then(addReviews)
    .then(addTheaters);
}

export async function deleteReview(reviewId) {
  const url = `${API_BASE_URL}/reviews/${reviewId}`;
  return await fetchJson(url, { method: "DELETE", headers }, {});
}

export async function updateReview(reviewId, data) {
  const url = `${API_BASE_URL}/reviews/${reviewId}`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data }),
  };
  return await fetchJson(url, options, {});
}
