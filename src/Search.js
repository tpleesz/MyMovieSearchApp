import React, {useState} from 'react';
import searchRelated from './SerchRelated';

export default function SearchMovies(){
    const [searching, setSearching] = useState(false);
    const [message, setMessage] = useState(null);
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [moviesw, setMoviesw] = useState([]);
    const [moviesr, setMoviesr] = useState([]);
    const [extid, setExtid] = useState([]);
    const searchMovies = async(e) =>{
        e.preventDefault();
        setSearching(true);
        const url = `https://api.themoviedb.org/3/search/movie?api_key=5863736706c2c1885e88c279d92b75cf&language=en-US&query=${query}&page=1&include_adult=false`;
         try{
            const response = await fetch(url);
            const data = await response.json();
            setMessage(null);
            setMovies(data);
            setSearching(false);
         }catch(err){
            alert('Failed to search TMDB');
            setMessage('An unexpected error occured.')
            setSearching(false);
         }
         const urlr = `https://api.themoviedb.org/3/movie/559969/similar?api_key=5863736706c2c1885e88c279d92b75cf&language=en-US&page=1`;
         try{
            const responser = await fetch(urlr);
            const datar = await responser.json();
            setMessage(null);
            setMoviesr(datar);
            setSearching(false);
         }catch(err){
            alert('Failed to search TMDB for related movies');
            setMessage('An unexpected error occured.')
            setSearching(false);
         }
         const urle = `https://api.themoviedb.org/3/movie/559969/external_ids?api_key=5863736706c2c1885e88c279d92b75cf`;
         try{
            const responsee = await fetch(urle);
            const datae = await responsee.json();
            setMessage(null);
            setExtid(datae);
            setSearching(false);
         }catch(err){
            alert('Failed to find eternal ids');
            setMessage('An unexpected error occured.')
            setSearching(false);
         }
         const url2 = `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${query}+incategory:English-language_films&origin=*`;
         try{
            const responsew = await fetch(url2);
            const dataw = await responsew.json();
            setMessage(null);
            setMoviesw(dataw);
            setSearching(false);
         }catch(err){
            alert('Failed to search Wiki');
            setMessage('An unexpected error occured.')
            setSearching(false);
         }
      }
        
         return (
            <div className="container mx-auto pt-6">
               <div class="flex justify-center max-w-screen-sm mx-auto overflow-hidden px-10">
               <form class="w-full h-10 pl-3 pr-2 bg-white border rounded-full flex justify-between items-center relative" onSubmit={searchMovies}>
                 <input type="text" name="query" placeholder="Search movies by name..."
                         class="appearance-none w-full outline-none focus:outline-none active:outline-none" value={query} onChange={(e) =>setQuery(e.target.value)}/>
                 <button type="submit" class="ml-1 outline-none focus:outline-none active:outline-none">
                 <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
               </form>
             </div>
                           <p class="font-medium text-lg">TMDB: <span class="font-normal text-base"> {JSON.stringify(movies)}</span></p>
                           <p class="font-medium text-lg">IMDB id: <span class="font-normal text-base"> {JSON.stringify(extid.imdb_id)}</span></p>
                           <p class="font-medium text-lg">TMDB related: <span class="font-normal text-base"> {JSON.stringify(moviesr)}</span></p>
                           <p class="font-medium text-lg">Wiki: <span class="font-normal text-base">{JSON.stringify(moviesw)}</span></p>


            </div>
                
            );
    }