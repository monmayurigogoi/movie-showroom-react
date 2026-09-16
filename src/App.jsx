import React from 'react'
import './App.css'
import Search from './components/Search.jsx'
import { useEffect, useState } from 'react'
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js' 


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'aplication/json',
    Authorization: `Bearer ${API_KEY}`  
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm),  500, [searchTerm]);

  const fetchMovies = async (searchText = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      // 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc' 
      // const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=1`;
      let endpoint;
      if(searchText.length > 0) {
        endpoint = `${API_BASE_URL}/search/movie?query=${searchText}&page=1`;
      } else {
        endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=1`;
      }





      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      console.log(response);
      const data = await response.json()
      console.log(data);

      setMovieList(data.results || []);

      if(searchText && data.results.length > 0) {
        await updateSearchCount(searchText, data.results[0]);
      }

    } catch (err) {
      console.error(`Error fetching movies: ${err}`); // this is only for developer's console
      setErrorMessage(`Error fetching movies. Please try again later. ${err.message}`); // this is for the user view
    } finally {
      setIsLoading(false)
    }
    
  }

  const loadTrendingMovies = async() => {
    try{
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
      setErrorMessage('');
    } catch(err) {
      console.error(`Error fetching Trending movies: ${err}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  useEffect(() => {
    loadTrendingMovies(); 
  }, []);

  return (
    <main>
      <div className='pattern'/>
      
      <div className='wrapper'>
        <header>
          <img src="./hero-img.png" alt="Hero Banner"/>
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoying without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
        </header>


        {
          trendingMovies.length > 0 && 
          <section className='trending'>
            <h2>Trending Movie</h2>

            <ul>
              {
                trendingMovies.map((movie, index) => {
                  return (
                    <li key={movie.$id}>
                      <p>{ index + 1}</p>
                      <img src={movie.poster_url} />
                    </li>
                  )
                })
              }
            </ul> 
          
            
          
          
          </section>
        }


        
        <section className='all-movies'>
          <h2>All Movies</h2>
          
          {
            isLoading &&
            <Spinner/>
          }

          {
            <ul>
              {
                movieList.map((movie) => {
                  return (
                    <MovieCard key={movie.id} movieData={movie}/>
                  )
                })
              }
            </ul>
          }

        </section>

        
        
      </div>
    </main>
  )
}


export default App
