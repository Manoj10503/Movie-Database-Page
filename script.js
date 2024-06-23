const API_KEY = '7bcc3e225838999a4d1cc28af1ba50ec';
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.endsWith('movie.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');
        fetchMovieDetails(movieId);
    } else {
        fetchMovies('popular');
    }
});

document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const query = document.getElementById('searchInput').value;
    if (query) {
        searchMovies(query);
    }
});

document.getElementById('home').addEventListener('click', () => fetchMovies('popular'));
document.getElementById('popular').addEventListener('click', () => fetchMovies('popular'));
document.getElementById('top-rated').addEventListener('click', () => fetchMovies('top_rated'));
document.getElementById('upcoming').addEventListener('click', () => fetchMovies('upcoming'));

async function fetchMovies(category) {
    try {
        const response = await fetch(`${API_URL}/movie/${category}?api_key=${API_KEY}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function searchMovies(query) {
    try {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMovies(movies) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.setAttribute('data-id', movie.id);

        const movieImage = document.createElement('img');
        movieImage.src = `${IMAGE_URL}${movie.poster_path}`;
        movieCard.appendChild(movieImage);

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');
        movieInfo.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Release Date: ${formatDate(movie.release_date)}</p>
            <p>Rating: ${movie.vote_average}</p>
        `;
        movieCard.appendChild(movieInfo);

        movieCard.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });

        mainContent.appendChild(movieCard);
    });
}



async function fetchMovieDetails(id) {
    try {
        const response = await fetch(`${API_URL}/movie/${id}?api_key=${API_KEY}`);
        const movie = await response.json();
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movieDetails');

    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-details');
    movieElement.innerHTML = `
        <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
        <div class="info">
            <h2>${movie.title}</h2>
            <p><strong>Release Date:</strong> ${formatDate(movie.release_date)}</p>
            <p><strong>Rating:</strong> ${movie.vote_average}</p>
            <p>${movie.overview}</p>
            <a href="${IMAGE_URL}${movie.poster_path}" class="download-button" download>Download Poster</a>
        </div>
    `;

    movieDetails.appendChild(movieElement);
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}
