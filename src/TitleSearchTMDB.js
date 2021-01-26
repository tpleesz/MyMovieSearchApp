export default async function TitleSearchTMDB(query){
  const url = `https://api.themoviedb.org/3/search/movie?api_key=5863736706c2c1885e88c279d92b75cf&language=en-US&query=${query}&page=1&include_adult=false`;
  try{
     const response = await fetch(url);
     const data = await response.json();
     return data;
  }catch(err){
     alert('Failed to search TMDB');
  }
}

