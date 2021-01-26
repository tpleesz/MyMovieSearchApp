export default async function RelatedSearchTMDB(query){
    const url = `https://api.themoviedb.org/3/movie/${query}/similar?api_key=5863736706c2c1885e88c279d92b75cf&language=en-US&page=1`;
    try{
       const response = await fetch(url);
       const data = await response.json();
       return data;
    }catch(err){
       alert('Failed to search TMDB');
    }
  }
  
  
