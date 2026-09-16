import React from "react";

const MovieCard = ({ movieData }) =>  {
    return (
        <div className="movie-card">
            <img src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`} />

            <div className="mt-4">
                <h3>{movieData.title}</h3>

                <div className="content">
                    <div className="rating">
                        <img src="star.png"/>
                        <p>{movieData.vote_average?.toFixed(1) || 'N/A'}</p>
                    </div>

                    <span>•</span>
                    
                    <p className="lang">{movieData.original_language}</p>

                    <span>•</span>

                    <p className="year">{movieData.release_date?.split('-')[0] || 'N/A'}</p>

                </div>
            </div>
        </div>
    )
}

export default MovieCard;