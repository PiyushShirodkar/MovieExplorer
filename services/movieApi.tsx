
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1MjRiNmU4OThlMTg2MTQyYmMzYjMwMGFlOTM3ZGExNSIsIm5iZiI6MTc5NDUwNTMyNS45ODUsInN1YiI6IjZhZjVmYTZkMDJiMWRmMThlOTRmZGRmYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QC9GYao-iScuBFJ2Tj6LicLLAcQ3-0WrWma6jSU6WHQ';

const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
};

const tmdbFetch = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(
      `TMDB API Error ${response.status}: ${responseText}`
    );
  }

  return JSON.parse(responseText);
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const data = await tmdbFetch('/movie/popular');
  return data.results || [];
};

export const searchMovies = async (
  query: string
): Promise<Movie[]> => {
  const data = await tmdbFetch(
    `/search/movie?query=${encodeURIComponent(query)}`
  );

  return data.results || [];
};

export const getMovieDetails = async (movieId: number) => {
  return await tmdbFetch(`/movie/${movieId}`);
};
