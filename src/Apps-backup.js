import React from 'react';
import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import clsx from 'clsx';
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
import Tooltip from '@material-ui/core/Tooltip';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

//import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';

//import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Search from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';

import Container from '@material-ui/core/Container';
import ButtonBase from '@material-ui/core/ButtonBase';
import Logo from './logo.svg';
import Poster from './poster.jpg';

import TitleSearchTMDB from './TitleSearchTMDB';
import RelatedSearchTMDB from './RelatedSearchTMDB';
import ExtIdSearchTMDB from './ExtIdSearchTMDB';
import WikiIdSearch from './WikiIdSearch';

function createData(title, genre, popularity, voteCount, voteAverage, poster, id) {
  return { title, genre, popularity, voteCount, voteAverage, poster, id};
}


var tmdbJson;
var tmdbArray;
var detailTitle = "Movie title";
var detailOldTitle = "Movie title";
var detailOverview = "Overview";
var detailPoster = "";
var detailId = 0;
var tableHeader = "Movies found";

var rows = [
  createData('Movie1', 305, 3.7, 67, 4.3,'',0),
  createData('Movie2', 452, 25.0, 51, 4.9,'',0),
  createData('Movie3', 262, 16.0, 24, 6.0,'',0),
  createData('Movie4', 159, 6.0, 24, 4.0,'',0),
  createData('Movie5', 356, 16.0, 49, 3.9,'',0),
  createData('Movie6', 408, 3.2, 87, 6.5,'',0),
  createData('Movie7', 237, 9.0, 37, 4.3,'',0),
  createData('Movie8', 375, 0.0, 94, 0.0,'',0),
  createData('Movie9', 518, 26.0, 65, 7.0,'',0),
  createData('Movie10', 392, 0.2, 98, 0.0,'',0),
  createData('Movie11', 318, 0, 81, 2.0,'',0),
  createData('Movie12', 360, 19.0, 9, 37.0,'',0),
  createData('Movie13', 437, 18.0, 63, 4.0,'',0),
];

function detOvHTML() {
  return detailOverview;
}


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Title'},
  { id: 'genre', numeric: false, disablePadding: false, label: 'Genre'},
  { id: 'popularity', numeric: true, disablePadding: false, label: 'Popularity' },
  { id: 'voteCount', numeric: true, disablePadding: false, label: 'Vote_#' },
  { id: 'voteAverage', numeric: true, disablePadding: false, label: 'Vote_Avg' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, rowCount, onRequestSort } = props;
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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar
      className={clsx(classes.root)}
    >
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          {tableHeader}
        </Typography>
    </Toolbar>
  );
};


const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 2000,
//    width: '100%',
//    color: 'red',
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
    maxWidth: 1200,
//    minHeight: 400,
    boxShadow: '0 0px 0px 0px',
  },
  media: {
    height: 0,
  },
});



export default function EnhancedTable() {
  const classes = useStyles();
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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.title);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, title, overview, id, poster) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(id);
    }
    setSelected(newSelected);
    detailTitle = title;
//    detailOverview = overview;
    detailPoster = poster;
    detailId = id;
    
  };

  const handleWikiClick = (event) => {
    var strWindowFeatures = "status=yes";
    var win;
    var imdbID = "";
    var wikiJson;
    var wikiURL = "";
    var wikiPlotShort ="";
    ExtIdSearchTMDB(detailId)
    .then(result => (tmdbJson = result))
    .then(result => (imdbID = tmdbJson.imdb_id))
    .then(result => (
        WikiIdSearch(imdbID)
        .then(result2 => (wikiJson = result2))
        .then(result2 => (wikiURL = wikiJson.url))
        .then(result2 => (wikiPlotShort = wikiJson.plotShort.html))
        .then(result2 => (detailOverview = wikiPlotShort))
        .then(result2 => (win = window.open(wikiURL, "_blank", strWindowFeatures)))
      ))
   };

  const handleImdbClick = (event) => {
    var strWindowFeatures = "status=yes";
    var URL = "https://www.imdb.com/title/";
    var win;
    var imdbID = "";
    ExtIdSearchTMDB(detailId)
    .then(result => (tmdbJson = result))
    .then(result => (imdbID = tmdbJson.imdb_id))
    .then(result => (win = window.open(URL+imdbID, "_blank", strWindowFeatures)))
   };

  const handleRelatedClick = (event) => {
    tableHeader = detailTitle + " - related movies";
    RelatedSearchTMDB(detailId)
    .then(result => (tmdbJson = result))
    .then(result => (tmdbJson = tmdbJson.results))
    .then(result => (tmdbArray = tmdbJson.map (movie => ({title: movie.title, popularity: movie.popularity, genre: "Valami genre", voteCount: movie.vote_count, voteAverage: movie.vote_average, poster: movie.poster_path, id: movie.id, overview: movie.overview}))))
    .then(result => (rows = tmdbArray))
    .then(result => (setSelected([])))
    .then(result => (setPage(0)))
    
};

  const handleSearchFieldEnter = (event) => {
    tableHeader = "Movies found";
    if(event.keyCode == 13){
        TitleSearchTMDB(event.target.value)
          .then(result => (tmdbJson = result))
          .then(result => (tmdbJson = tmdbJson.results))
          .then(result => (tmdbArray = tmdbJson.map (movie => ({title: movie.title, popularity: movie.popularity, genre: "Valami genre", voteCount: movie.vote_count, voteAverage: movie.vote_average, poster: movie.poster_path, id: movie.id, overview: movie.overview}))))
          .then(result => (rows = tmdbArray))
          .then(result => (setSelected([])))
          .then(result => (setPage(0))) 
//          .then(result => (tableHeader = "Movies found"))
    }
  }; 

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (title) => selected.indexOf(title) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
    <Container maxWidth ="md">
      <br/>
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
      <Paper className={classes.paper}>
        <EnhancedTableToolbar/>
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
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
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
                      <TableCell align="right">{row.popularity}</TableCell>
                      <TableCell align="right">{row.voteCount}</TableCell>
                      <TableCell align="right">{row.voteAverage}</TableCell>
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
                  </Typography>
 
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={(event) => handleWikiClick(event)}
                >
                  Wikipedia
                </Button>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={(event) => handleImdbClick(event)}
                >
                  IMDB
                </Button>
                <Button 
                  size="small" 
                  color="secondary"
                  onClick={(event) => handleRelatedClick(event,detailTitle)}
                >
                  Related movies
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid> 
      </Paper> 
    </Container>      
    <br/><br/><br/><br/>
    </div>
  );
}
