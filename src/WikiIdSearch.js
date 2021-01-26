export default async function WikiIdSearchTMDB(query){
    const url = `https://imdb-api.com/en/API/Wikipedia/k_68dd422k/${query}`;
    try{
       const response = await fetch(url);
       const data = await response.json();
       return data;
    }catch(err){
       alert('Failed to search Wiki ID');
    }
  }
  