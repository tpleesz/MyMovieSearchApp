import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import NumberFormat from 'react-number-format';
import parse from 'html-react-parser';

import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Search from '@material-ui/icons/Search';
import LinearProgress from '@material-ui/core/LinearProgress';
import Container from '@material-ui/core/Container';

import Poster from './poster.jpg';
import WikiLogo from './Wikipedia_Logo.png';

import TitleSearchTMDB from './TitleSearchTMDB';
import RelatedSearchTMDB from './RelatedSearchTMDB';
import ExtIdSearchTMDB from './ExtIdSearchTMDB';
import GenresTMDB from './GenresTMDB';
import WikiIdSearch from './WikiIdSearch';


var tmdbJson;
var tmdbArray;

var tableHeader = "Movies will be listed here after search";

var detailId = 0;
var detailTitle = "Click on a movie above after search to see details";
var detailOverview = "";
var wikiPlotShort ="";
var detailPoster = "";
var clickForWikiDesc = "";
var showWikiDescription = false;

var isSearching = false;

var rows = [];
var genres = [];


function fillGenreArray() {
 GenresTMDB()
   .then(result => (tmdbJson = result))
   .then(result => (tmdbJson = tmdbJson.genres))
   .then(result => (tmdbArray = tmdbJson.map (genre => ({id: genre.id, name: genre.name}))))
   .then(result => (genres = tmdbArray))
}

fillGenreArray();


function myCompare(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


function selectMyCompare(order, orderBy) {
  return order === 'desc'
    ? (a, b) => myCompare(a, b, orderBy)
    : (a, b) => -myCompare(a, b, orderBy);
}


function myTableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
      return a[1] - b[1];
    });
  return stabilizedThis.map((el) => el[0]);
}


const useTitleStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  tableRow: {
    height: 70
  },
}));


const useGenStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 2000,
      background: 'lightgrey',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,  
  },
  textField: {
    width: '75ch',
  },
  margin: {
    margin: theme.spacing(10),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));


const useCardStyles = makeStyles({
  root: {
    maxWidth: 650,
    boxShadow: '0 0px 0px 0px',
  },
});




export default function MyMovieSearchApp() {
  const classes = useGenStyles();
  const classesCard = useCardStyles();

  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleClick = (event, title, overview, id, poster) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(id);
    }
    setSelected(newSelected);
    detailTitle = title;
    detailOverview = overview;
    detailPoster = poster;
    detailId = id;
    clickForWikiDesc = "... click for Wikipedia description";
    showWikiDescription = false;
  };


  const handleWikiClick = (event) => {
    var strWindowFeatures = "status=yes";
    var win;
    var imdbID = "";
    var wikiJson;
    var wikiURL = "";
    ExtIdSearchTMDB(detailId)
    .then(result => (tmdbJson = result))
    .then(result => (imdbID = tmdbJson.imdb_id))
    .then(result => (
        WikiIdSearch(imdbID)
        .then(result2 => (wikiJson = result2))
        .then(result2 => (wikiURL = wikiJson.url))
        .then(result2 => (wikiURL? win = window.open(wikiURL, "_blank", strWindowFeatures): alert("There is no Wikipedia page available for this movie")))
      ))
  };


  const handleWikiDescriptionClick = (event) => {
   var imdbID = "";
   var wikiJson;
   var wikiURL = "";
   ExtIdSearchTMDB(detailId)
   .then(result => (tmdbJson = result))
   .then(result => (imdbID = tmdbJson.imdb_id))
   .then(result => (imdbID? (
       WikiIdSearch(imdbID)
       .then(result2 => (wikiJson = result2))
       .then(result2 => (wikiURL = wikiJson.url))
       .then(result2 => (wikiPlotShort = wikiJson.plotShort.html))
       .then(result2 => (wikiURL? showWikiDescription = true : alert("There is no Wikipedia page available for this movie")))
       .then(result2 => (setSelected([])))) :  alert("There is no Wikipedia page available for this movie")
        ))
  };
  
  
  const handleWikiHideClick = (event) => {
   showWikiDescription = false;
   setSelected([]);
  };  


  const handleImdbClick = (event) => {
    var strWindowFeatures = "status=yes";
    var URL = "https://www.imdb.com/title/";
    var win;
    var imdbID = "";
    ExtIdSearchTMDB(detailId)
    .then(result => (tmdbJson = result))
    .then(result => (imdbID = tmdbJson.imdb_id))
    .then(result => (imdbID? win = window.open(URL+imdbID, "_blank", strWindowFeatures) : alert("There is no IMDB page available for this movie")))
   };


  const handleRelatedClick = (event) => {
    tableHeader = detailTitle + " - related movies";
    isSearching = true;
    setSelected([]);
    setPage(0);
    RelatedSearchTMDB(detailId)
      .then(result => (tmdbJson = result))
      .then(result => (tmdbJson = tmdbJson.results))
      .then(result => (tmdbArray = tmdbJson.map (movie => ({
        title: movie.title, 
        popularity: movie.popularity, 
        genre: (movie.genre_ids.length>0 ? genres.find(element => element.id == movie.genre_ids[0]).name : ""), 
        voteCount: movie.vote_count, 
        voteAverage: movie.vote_average, 
        poster: movie.poster_path, 
        id: movie.id, 
        overview: movie.overview
      }))))
      .then(result => (rows = tmdbArray))
      .then(result => (isSearching = false))
      .then(result => (rows.length == 0 ? tableHeader = "No rerelated movies found" : tableHeader = detailTitle + " - related movies"))
      .then(result => (setSelected([])))
      .then(result => (setPage(0)))
  };


  const handleSearchFieldEnter = (event) => {
    tableHeader = "Movies found";
    if(event.target.value && event.keyCode == 13){
      detailTitle = "Click on a movie above after search to see details";
      detailOverview = "";
      wikiPlotShort ="";
      detailPoster = "";
      detailId = 0;
      clickForWikiDesc = "";
      isSearching = true;
      setSelected([]);
      setPage(0);
      TitleSearchTMDB(event.target.value)
          .then(result => (tmdbJson = result))
          .then(result => (tmdbJson = tmdbJson.results))
          .then(result => (tmdbArray = tmdbJson.map (movie => ({
            title: movie.title, 
            popularity: movie.popularity, 
            genre: (movie.genre_ids.length>0 ? genres.find(element => element.id == movie.genre_ids[0]).name : ""), 
            voteCount: movie.vote_count, 
            voteAverage: movie.vote_average, 
            poster: movie.poster_path, 
            id: movie.id, 
            overview: movie.overview
          }))))
          .then(result => (rows = tmdbArray))
          .then(result => (isSearching = false))
          .then(result => (rows.length == 0 ? tableHeader = "No movies found" : tableHeader = "Movies found"))
          .then(result => (setSelected([])))
          .then(result => (setPage(0))) 
    }
  }; 


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const isSelected = (title) => selected.indexOf(title) !== -1;


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


  const headCells = [
    { id: 'title', numeric: false, disablePadding: false, label: 'Title'},
    { id: 'genre', numeric: false, disablePadding: false, label: 'Genre'},
    { id: 'popularity', numeric: true, disablePadding: false, label: 'Popularity' },
    { id: 'voteCount', numeric: true, disablePadding: false, label: 'Vote_#' },
    { id: 'voteAverage', numeric: true, disablePadding: false, label: 'Vote_Avg' },
  ];
  
  const MyMovieTableHead = (props) =>  {
    const { classes, order, orderBy, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
    return (
      <TableHead>
        <TableRow>
          <TableCell />
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  MyMovieTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };
  

  const MyMovieSearchField = (props) => {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2} alignItems="flex-end" >
          <Grid item xs={1} />
          <Grid item >
            <Search />
          </Grid>
          <Grid item xs={9}> 
            <TextField 
              fullWidth id="input-with-icon-grid" 
              label="Search for your movie" 
              onKeyDown={(event) => handleSearchFieldEnter(event)}
            />
          </Grid>
        </Grid>
      </Paper>  
    )
  };


  const MyMovieTableTitle = (props) => {
    const classes = useTitleStyles();
    if(isSearching) {
      return <LinearProgress />;
    }  
    else { return (
      <Toolbar
        className={clsx(classes.root)}
      >
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div" > 
          {tableHeader}
        </Typography>
      </Toolbar>
    )}
  };

  
  const MyMovieDetailPanel = (props) => {
    return (
      <Paper className={classes.paper}>
        <Grid container spacing={2} >
          <Grid item xs={3}>
            <Box className={classes.image} align="left" pl = {1.5} pt = {0.5} >
              <img className={classes.img} src={detailPoster? "https://image.tmdb.org/t/p/w500"+detailPoster : Poster} height={280}/>
            </Box>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item container direction="column" spacing={0}>

              <Card className={classesCard.root}>

                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {detailTitle}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {parse(detailOverview)}
                      <Box color="primary" onClick={(event) => handleWikiDescriptionClick(event)} display = {showWikiDescription ? "none" : ""}>
                        <Typography variant="body2" color="textPrimary" component="p">
                           <br/> {clickForWikiDesc}
                        </Typography>
                      </Box>
                      <Box color="primary"  display = {showWikiDescription ? "" : "none"}>
                        <Typography variant="body2" color="textSecondary" component="p">
                          <br/><br/>
                          <img className={classes.img} src={WikiLogo} height={70}/>
                          {parse(wikiPlotShort)}
                        </Typography>
                        <Typography variant="body2" color="textPrimary" component="p" onClick={(event) => handleWikiHideClick(event)}>
                           ... click to hide Wikipedia description
                        </Typography>
                      </Box>
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box display = {detailOverview ? "" : "none"}>
                  <CardActions >
                    <Button size="small" color="primary" onClick={(event) => handleWikiClick(event)} >
                      Wikipedia
                    </Button>
                    <Button size="small" color="primary" onClick={(event) => handleImdbClick(event)}>
                      IMDB
                    </Button>
                    <Button size="small" color="secondary" onClick={(event) => handleRelatedClick(event)}>
                      Related movies
                    </Button>
                  </CardActions>
                </Box>
      
              </Card>

            </Grid>
          </Grid>
        </Grid> 
      </Paper> 
    )
  };


  return (
    <div className={classes.root}>
    <Container maxWidth ="md">
      <br/>
      <MyMovieSearchField/>
    
      <Paper className={classes.paper}>
 
        <MyMovieTableTitle/>
 
        <TableContainer>
 
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size= 'small'
            aria-label="enhanced table"
          >
            <colgroup>
              <col width="7%" />
              <col width="43%" />
              <col width="20%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
            </colgroup>
 
            <MyMovieTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />

            <TableBody>
              {myTableSort(rows, selectMyCompare(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.title);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.title, row.overview, row.id, row.poster)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.title}
                      selected={isItemSelected}
                      height={80}
                    >
                      <TableCell padding="none" align="center" style={{ verticalAlign: 'bottom' }}>
                        <img className={classes.img} src={row.poster? "https://image.tmdb.org/t/p/w200"+row.poster : Poster} height={70}/>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="checkbox">
                        {row.title}
                      </TableCell>
                      <TableCell align="left">{row.genre}</TableCell>
                      <TableCell align="right">
                        <NumberFormat value = {row.popularity} displayType = "text" decimalScale = {2} fixedDecimalScale = {true}/> 
                      </TableCell>
                      <TableCell align="right">
                        <NumberFormat value = {row.voteCount} displayType = "text" thousandSeparator = " "/> 
                      </TableCell>
                      <TableCell align="right">
                        <NumberFormat value = {row.voteAverage} displayType = "text" decimalScale = {1} fixedDecimalScale = {true}/> 
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 80 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

          </Table>

        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
        />
      </Paper>
      
      <MyMovieDetailPanel/>

    </Container>      
    <br/><br/><br/><br/>
    </div>
  );
}
