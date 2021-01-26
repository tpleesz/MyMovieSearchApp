import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

export default function movieSearch() {
    fetch('https://api.themoviedb.org/3/search/movie', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
      },
      body: {
        api_key: '5863736706c2c1885e88c279d92b75cf',
        query: 'Breaking bad',
        include_adult: false
      }
    })
    .then(response => {
        console.log(response)
      })
      .catch(err => {
        console.log(err)
      })
      console.log('done');
      return (
      <Paper>
      <Grid container spacing={2} alignItems="flex-end" >
        <Grid item xs={1} />
        <Grid item xs={9}> 
          <TextField fullWidth id="input-with-icon-grid" label={1} />
        </Grid>
      </Grid>
      </Paper>
     )
  }
  