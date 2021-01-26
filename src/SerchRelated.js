
 export default async function searchRelated(searchQuery) {
    const endpoint = `https://api.themoviedb.org/3/movie/559969/similar?api_key=5863736706c2c1885e88c279d92b75cf&language=en-US&page=1`; 
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
      alert('Failed to search TMDB for related movies');
    }
    const json = await response.json();
    return json;
  }
 