export default async function GenresTMDB(){
  const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=5863736706c2c1885e88c279d92b75cf&language=en-US`;
  try{
     const response = await fetch(url);
     const data = await response.json();
     return data;
  }catch(err){
     alert('Failed to search TMDB');
  }
}

