import './App.css';

import {useEffect, useState} from "react";
import { Switch, Route, Redirect, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useHistory } from "react-router-dom";
import { useFormik } from 'formik';
import * as yup from 'yup';


// const API_URL = "https://616d58f537f997001745d9d1.mockapi.io";
const API_URL = "https://b28wd-movies-db.herokuapp.com";

export default function App() {
  // console.log("hi");

const [movies, setMovies] = useState([]);
const history = useHistory();
const [mode, setMode] = useState("dark");
const darkTheme = createTheme({
  palette: {
    mode: mode,
  },
});

// App is mounted -> useEffect call only once -> inside fetch -> and setMovies 
console.log(movies);
useEffect(()=>{
  fetch(`${API_URL}/movies`, {method:"GET"})
  .then((data)=>data.json())
  .then((mvs)=>setMovies(mvs));
}, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper elevation={3} style={{borderRadius:"0px",minHeight:"100vh"}}>

    <div className="App">
       <AppBar position="static">
       <Toolbar>
       <Button varient="text" color="inherit" onClick={()=>history.push("/")}>Home</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/addmovies")}>AddMovies</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/movielist")}>Movielist</Button>

       <Button varient="text" color="inherit" onClick={()=>history.push("/addcolor")}>Addcolor</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/tic-tac-toe")}>Tic-Tac-Toe Game</Button>
       <Button varient="text" color="inherit" onClick={()=>history.push("/basicform")}>Basic Form</Button>

       <Button varient="text" color="inherit" style={{marginLeft:"auto"}} onClick={()=>setMode(mode==="light"? "dark":"light")}> {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />} {mode==="light"? "Dark":"Light"}Mode</Button>
       </Toolbar>
       </AppBar>

      <Switch>
      
      <Route exact path="/">
          <Home />
        </Route>

      <Route path="/films">
          <Redirect to="/movielist" />
        </Route>
       
        <Route path="/addmovies">
          <AddMovie />
        </Route>

        <Route path="/movielist/edit/:id">
        <EditMovie />
        </Route>

        <Route path="/movielist/:id">
        <MovieDetails />
        </Route>

        <Route path="/movielist">
        <MovieList />
        </Route>

        <Route path="/addcolor">
        <AddColor/>
        </Route>

        <Route path="/tic-tac-toe">
        <TicTacToe/>
        </Route> 

        
        <Route path="/basicform">
        <BasicForm/>
        </Route> 


        <Route path="**">
          <NotFound/>
        </Route>

        

      </Switch>
   
    </div>
    </Paper>
    </ThemeProvider>
  );
}
//when two  components needs the same data(movies)-> put the data in the common parent component (App) - HOC - Higher order components 

// const validateForm = (values) => {
//   const errors = {};
//   console.log("validateform", values);

  // email min 5 chars
  // if(values.email.length < 5){
  //   errors.email = "please provide a longer email";
  // }  
  // else if (!/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$.test(values.email)){
  //   errors.email = "invalid email address";
  // }
  //min 8 chars
  // if(values.password.length < 8){
  //   errors.password = "please provide a longer password";
  // }
  //max 12 chars
//   else if(values.password.length > 12){
//     errors.password = "please provide a shorter password";
//   }
//   console.log(errors);
//   return errors;
// }
 const formvalidationschema = yup.object({
   email: yup.string().min(5, "need a bigger email").required(),
   password: yup.string().min(5).max(12).required(),
 });

function BasicForm(){

  const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
    initialValues: { email: "", password:""},
    // validate: validateForm,
    validationSchema: formvalidationschema,

    onSubmit: (values) => {
      console.log("onsubmit", values);
    }
  });

  return(
    <form onSubmit={handleSubmit}>
      <input id="email" 
      name="email" 
      value = {values.email} 
      onChange={handleChange} 
      onBlur={handleBlur}
      type = "email" 
      placeholder = "Enter your Email"/>
{/* only when the user moves away show the error */}
     {errors.email && touched.email && errors.email}

      <input id="password" 
      name="password" 
      value = {values.password} 
      onChange={handleChange} 
      onBlur={handleBlur}
      type = "password" 
      placeholder = "Enter your Password"/>

      {/* only when the user moves away show the error */}
      {errors.password && touched.password ? errors.password:""}
    
      <button type="submit" >submit</button>
    </form>
  );
}

function TicTacToe(){
  const [board, setBoard] = useState([null,null,null,null,null,null,null,null,null]);
  const [isXTurn, setIsXTurn ] = useState(true);
  
  
const decideWinner = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6],
  ];

  // if winning condition present in board then we have a winner

  for (let i=0; i<lines.length;i++){
    const [a,b,c] = lines[i];

    if(board[a]!==null && board[a]===board[b] && board[b]=== board[c]){
      return board[a];
    }
  }
  return null;
};

const winner = decideWinner(board);
const handleClick = (index) =>{

  //create a copy of the board & then update the clicked box

  // update only untouched box
  if (winner===null && board[index] ===null){
    //(!board[index])
    const boardCopy =[...board];
    boardCopy[index] = isXTurn ?"x":"o";
    setBoard(boardCopy);
   //toggle x Turn
   setIsXTurn(!isXTurn);

  }
};
  return(
    <div className="full-game">
    <div className="board">
      {board.map((val,index)=>(<GameBox val ={val} onPlayerClick={()=>handleClick(index)}/>))}
      </div>
      {winner?<p>winner is: {winner}</p>:""}
      </div>
  ); 
}
function GameBox({val,onPlayerClick}){
  // const [val, setVal] = useState(null);
  const styles = {color: val==="x"?"green":"red"}
  return(
    <div  style ={styles} onClick={onPlayerClick} className="game-box">
     {val}
    </div>
  );
}

function NotFound(){
  return(
    <div className="not-found-pic">
      <h1 className="not-found-name">404 Not Found</h1>
      <img  src="https://s12emagst.akamaized.net/assets/hu/images/error_404_600px.gif" alt="404 not found"/>
    </div>
  );
}
function Home() {
  return (
    <div className="home">
      <h2 className="home-hello">Hello All!!!</h2>
      <img className="home-pic" src="https://c.tenor.com/NuKLjcqaiqsAAAAC/welcome.gif" alt="welcome"/>
    </div>
  );
}

function MovieDetails() {
  const history = useHistory();
  const {id} = useParams();
  // const moviedet = movies[id]; 
  console.log("the id is ", id);

const [moviedet, setMoviedet] = useState({});

useEffect(()=>{
  fetch(`${API_URL}/movies/${id}`, {method:"GET"})
  .then((data)=>data.json())
  .then((mv)=>setMoviedet(mv));
}, [id]);

  console.log(moviedet);
  const styles = {
    color: moviedet.rating<8? "crimson":"green",
    fontWeight:"bold"
  };
  return(
  <div className="details">
        <iframe width="1430" height="650" src={moviedet.trailer} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
        <div className="det"> 
        <h1 className="user-name">{moviedet.name}</h1>
      <p style= {styles}> ⭐{moviedet.rating} </p>
      </div>
     
    <p>{moviedet.summary}</p>
    
    <Button onClick={()=>history.push("/movielist") }variant="outlined"><KeyboardBackspaceIcon/>Back</Button>
    </div>
  );
}

function EditMovie(){
 
  const {id} = useParams();
  // const moviedet = movies[id]; 
const [moviedet, setMoviedet] = useState(null);
useEffect(()=>{
  fetch(`${API_URL}/movies/${id}`, {method:"GET"})
  .then((data)=>data.json())
  .then((mv)=>setMoviedet(mv));
}, [id]);
//only show update movie when data is available
  return moviedet? <UpdateMovie moviedet={moviedet}/>:"";
  
}
function UpdateMovie({moviedet}){
  const history = useHistory();

  const formvalidationschema = yup.object({
    pic: yup.string().required("why not fill this pic?").min(4),
    name: yup.string().required("why not fill this name?").min(1),
    rating: yup.number().required("why not fill this rating?").min(0).max(10),
    summary: yup.string().required("why not fill this summary?").min(20),
    trailer: yup.string().required("why not fill this trailer?").min(5),
  });

  const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
    initialValues: { name: moviedet.name, pic:moviedet.pic, rating:moviedet.rating, summary:moviedet.summary, trailer:moviedet.trailer},
    // validate: validateForm,
    validationSchema: formvalidationschema,
  
    onSubmit: (updatedMovie) => {
      console.log("onsubmit", updatedMovie);
      editMovie(updatedMovie);
    }
  });
  // const [name, setName] = useState(moviedet.name);
  // const [pic, setPic] = useState(moviedet.pic);
  // const [rating, setRating] = useState(moviedet.rating);
  // const [summary, setSummary] = useState(moviedet.summary);
  // const [trailer, setTrailer] = useState(moviedet.trailer);

  const editMovie =(updatedMovie)=>{
   
    // const updatedMovie= {pic, name, rating, summary,trailer};//shorthand
    console.log(updatedMovie);
    // setMovies([...movies,updatedMovie]);
    // const copyMovieList =[...movies];
    // copyMovieList[id] = updatedMovie;
    // setMovies(copyMovieList);
    // history.push("/movielist");
    // 1. method - put
  // 2. body - data & json & pass id as params
  // 3. headers - JSON

  fetch(`${API_URL}/movies/${moviedet.id}`, {
    method:"PUT",
    body: JSON.stringify(updatedMovie),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/movielist"))
  };

  
  return(
    <form onSubmit={handleSubmit} className="in-con">
    
    <TextField id="pic" 
      name="pic" 
      value = {values.pic} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter movie url" 
       error={errors.pic && touched.pic}
       helperText={errors.pic && touched.pic && errors.pic}
       variant="filled" />
       
     
     <TextField id="name" 
      name="name" 
      value = {values.name} 
      onChange={handleChange} 
      onBlur={handleBlur}
      label="enter movie name"
      error={errors.name && touched.name}
      helperText={errors.name && touched.name && errors.name}
       variant="filled" />
      

      <TextField id="rating" 
      name="rating" 
      value = {values.rating} 
      onChange={handleChange} 
      onBlur={handleBlur}  
      label="enter movie rating" 
      error={errors.rating && touched.rating}
       helperText={errors.rating && touched.rating && errors.rating}
      variant="filled" />
      

      <TextField id="summary" 
      name="summary" 
      value = {values.summary} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie summary" 
      error= {errors.summary && touched.summary}
      helperText= {errors.summary && touched.summary && errors.summary}
      variant="filled" />
     
      <TextField id="trailer" 
      name="trailer" 
      value = {values.trailer} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie trailer"
      error=  {errors.trailer && touched.trailer}
      helperText= {errors.trailer && touched.trailer && errors.trailer}
      variant="filled" />
     
          <Button type="submit" variant="contained">Save</Button>
         
        </form>
      );
}


function AddMovie(){
  const history = useHistory();
//   const [name, setName] = useState("");
// const [pic, setPic] = useState("");
// const [rating, setRating] = useState("");
// const [summary, setSummary] = useState("");
// const [trailer, setTrailer] = useState("");

const formvalidationschema = yup.object({
  pic: yup.string().required("why not fill this pic?").min(4),
  name: yup.string().required("why not fill this name?").min(1),
  rating: yup.number().required("why not fill this rating?").min(0).max(10),
  summary: yup.string().required("why not fill this summary?").min(20),
  trailer: yup.string().required("why not fill this trailer?").min(5),
});

const {handleSubmit, values, handleChange, handleBlur, errors, touched} = useFormik({
  initialValues: { name: "", pic:"", rating:"", summary:"", trailer:""},
  // validate: validateForm,
  validationSchema: formvalidationschema,

  onSubmit: (newMovies) => {
    console.log("onsubmit", newMovies);
    addMovie(newMovies);
  }
});

const addMovie =(newMovies)=>{
//   const newMovies= {pic, name, rating, summary,trailer};//shorthand
//   // setMovies([...movies,newMovies]);
console.log(newMovies)
  fetch(`${API_URL}/movies`, {
    method:"POST",
    body: JSON.stringify(newMovies),
    headers: {'Content-Type': 'application/json'},
}).then(()=>history.push("/movielist"));
  
};

  return(
<form onSubmit={handleSubmit} className="in-con">

<TextField id="pic" 
      name="pic" 
      value = {values.pic} 
      onChange={handleChange} 
      onBlur={handleBlur}
       label="enter movie url" 
       error={errors.pic && touched.pic}
       helperText={errors.pic && touched.pic && errors.pic}
       variant="filled" />
       
     
     <TextField id="name" 
      name="name" 
      value = {values.name} 
      onChange={handleChange} 
      onBlur={handleBlur}
      label="enter movie name"
      error={errors.name && touched.name}
      helperText={errors.name && touched.name && errors.name}
       variant="filled" />
      

      <TextField id="rating" 
      name="rating" 
      value = {values.rating} 
      onChange={handleChange} 
      onBlur={handleBlur}  
      label="enter movie rating" 
      error={errors.rating && touched.rating}
       helperText={errors.rating && touched.rating && errors.rating}
      variant="filled" />
      

      <TextField id="summary" 
      name="summary" 
      value = {values.summary} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie summary" 
      error= {errors.summary && touched.summary}
      helperText= {errors.summary && touched.summary && errors.summary}
      variant="filled" />
     
      <TextField id="trailer" 
      name="trailer" 
      value = {values.trailer} 
      onChange={handleChange} 
      onBlur={handleBlur}  label="enter movie trailer"
      error=  {errors.trailer && touched.trailer}
      helperText= {errors.trailer && touched.trailer && errors.trailer}
      variant="filled" />
     
      <Button type="submit" variant="contained">Add movies</Button>
     
    </form>
  );
} 

function Counter(){
  const [like, setLike] = useState(0);
  const [disLike, setDisLike] = useState(0);
  return(
<div className="button-like">
<IconButton onClick={()=> setLike(like+1)} aria-label="like">
<Badge badgeContent={like} color="primary">👍</Badge>
      </IconButton>
      <IconButton onClick={()=> setDisLike(disLike+1)} aria-label="dislike">
<Badge badgeContent={disLike} color="error">👎</Badge>
      </IconButton>
  
  </div>
  );
}
function MovieList(){
  const [movies, setMovies] = useState([]);
  // App is mounted -> useEffect call only once -> inside fetch -> and setMovies 
const getMovies = () => {
  fetch(`${API_URL}/movies`, {method:"GET"})
  .then((data)=>data.json())
  .then((mvs)=>setMovies(mvs));
};


useEffect(getMovies, []);

const deleteMovie = (id) =>{
  fetch(`${API_URL}/movies/${id}`, {method:"DELETE"})
  .then(()=>getMovies());
};

  const history = useHistory();
  return(
    <section>
         {movies.map(({pic, name, rating, summary, id, _id})=>(
       <Movie key={_id} name={name} pic={pic} rating={rating} summary={summary} id={_id}
       deleteButton= {<IconButton aria-label="delete" color="error"
       onClick={()=> deleteMovie(_id)}>
       <DeleteIcon />
     </IconButton>}
       editButton= {<IconButton 
        style={{marginLeft:"auto"}}
        aria-label="edit"  color="success"
       onClick={()=>history.push("/movielist/edit/" + _id)}>
       <EditIcon />
     </IconButton>}
       />
     ))}
    </section>
  );
}

function Movie({pic, name, rating, summary,id,deleteButton,editButton}){
const [show,setShow] = useState(true);
const history = useHistory();
const styles = {
  color: rating<8? "crimson":"green",
  fontWeight:"bold"
};
const summaryStyles = {
  display:show?"block":"none"
};
  return (
    
    <div className="container">
     
      <div className="full-det">
      
      <img className="user-pic" src={pic} alt={name}/>
      <div className="details">
        
        <div className="det"> <h1 className="user-name">{name}  
        <IconButton onClick={()=>{console.log(id);
        // /movies/0
        history.push("/movielist/"+id);
        }} color="info" aria-label="more-info">
        <InfoIcon/>
</IconButton>
<IconButton onClick={()=>setShow(!show)} color="primary" aria-label="description">
 {show?<ExpandLessIcon/>:<ExpandMoreIcon/>}
</IconButton>
</h1>
       
      <p style= {styles}> ⭐{rating} </p>
      </div>
     {/* <button >{show?"hide":"show"}description</button> */}
      {show?<p style={summaryStyles}>{summary}</p>:""}
      <div className="count-edit"><Counter/>
{editButton}{deleteButton}</div>
      
      
    </div>
    </div>
    </div>
    
    
  );
}

function AddColor(){
  const [color, setColor] = useState("pink");
const styles = {backgroundColor: color};
const [colors, setColors] = useState(["teal", "orange"]);
  return(
    <div>
      <input
      value={color}
      onChange={(event)=>setColor(event.target.value)}
      style={styles}
      placeholder="enter a color"
      />
       
      <button onClick={()=> setColors([...colors, color])}>Add color</button>
      {colors.map((clr,index)=>(<ColorBox key={index} color={clr}/>))}
    </div>
  );
}

function ColorBox({color}){
  const styles = {
    backgroundColor:color,
    height: "40px",
    width:"600px",
    marginTop:"10px",
  };
  return <div style = {styles}></div>
}


 
