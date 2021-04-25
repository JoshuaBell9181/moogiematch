import React, { useState, useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import TinderCard from 'react-tinder-card'

let moviesState = []

function remove_duplicates_safe(arr) {
  var seen = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
      if (!(arr[i] in seen)) {
          ret_arr.push(arr[i]);
          seen[arr[i]] = true;
      }
  }
  return ret_arr;

}

const alreadyRemoved = []

function Advanced (props) {
  const [userId, setUserId] = useState(uuidv4())
  const [movies, setMovies] = useState([])
  const [lastDirection, setLastDirection] = useState()
  const [likeMovies, setLikedMovies] = useState([])
  const [othersLikeMovies, setOthersLikedMovies] = useState({
    // user1: ['The Dig','Alone'],
    // user2: ['The Dig','The Trial of the Chicago 7']
  })
  const [matchedMovies, setmatchedMovies] = useState([])

  useEffect(()=>{
    fetch("/movies")
    .then(res => res.json())
    .then(data => {
      setMovies(data);
      moviesState = data});
  }, [])

  props.socket.on('message', payload => {
    //Do something with payload
    let tmpArray = othersLikeMovies
    if(tmpArray[payload.userId] !== undefined){
      tmpArray[payload.userId].push(payload.movie.name)
    } else {
      tmpArray[payload.userId] = [payload.movie.name]
    }

    tmpArray = remove_duplicates_safe(tmpArray)
    setOthersLikedMovies(tmpArray)

    const result = othersMatcheMe(payload.movie, payload.count)
    if (result){
      // Create a better match notification
      result.count = result.count - 1
      alert(result.count + " matched for " + payload.movie.name)
    }
  })

  const othersMatcheMe = (movie, count)=>{

    let movieMatch = undefined;
    likeMovies.forEach((element)=> { 
      if (element.name === movie.name) {
        movieMatch = {
          movie: movie,
          count: count + 1
        }
        return movieMatch
      } 
    });

    return movieMatch === undefined ? false : movieMatch
  }


  const hasMatches = (movie)=>{

    let count = 1;
    for (const otherUserLikeMoviesIndex in othersLikeMovies){
      const otherUserLikeMovies = othersLikeMovies[otherUserLikeMoviesIndex]
      if (otherUserLikeMovies !== undefined && otherUserLikeMovies.indexOf(movie.name) > -1) {
        if (count === Object.keys(othersLikeMovies).length){
          const movieMatch = {
            movie: movie,
            count: count + 1
          }
          setmatchedMovies(matchedMovies.push(movieMatch))
          return movieMatch
        }
        count++;
      } else {
        break;
      }
    }

    return false
  }

  const childRefs = useMemo(() => Array(movies.length).fill(0).map(i => React.createRef()), [])

  const swiped = (direction, movie) => {
    console.log('removing: ' + movie.name)
    setLastDirection(direction)

    if(direction === "down"){
      alert(movie.descripton)
    } else if(direction === "right"){

      setLikedMovies(likeMovies.push(movie));
      const result = hasMatches(movie)
      if (result){
        // Create a better match notification
        alert(result.count + " Likes for this movie")
        props.socket.emit('message', {
          movie: movie,
          count: result.count,
          userId: userId
        }, props.code)
      } else {
        props.socket.emit('message', {
          movie: movie,
          count: 1,
          userId: userId
        }, props.code)
      }
      alreadyRemoved.push(movie.name)

    } else if(direction === "left"){
      alreadyRemoved.push(movie.name)
    } else if(direction === "up"){
      // List matches
      let table = {}
      let removeDupsMatchMovies = []
      matchedMovies.forEach((element)=> { table[element.movie.name] = element})
      for(const element in table){ 
        removeDupsMatchMovies.push(table[element])
      }

      let moviesList = "movies:";
      removeDupsMatchMovies.forEach((item)=>{moviesList = moviesList + `\n ${item.movie.name} has likes ${item.count}`});
      alert(moviesList)
    }
    
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
    moviesState = moviesState.filter(movie => movie.name !== name)
    setMovies(moviesState)
  }

  const swipe = (dir) => {
    const cardsLeft = movies.filter(movie => !alreadyRemoved.includes(movie.name))
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].name // Find the card object to be removed
      const index = movies.map(movie => movie.name).indexOf(toBeRemoved) // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved) // Make sure the next card gets removed next time if this card do not have time to exit the screen
      childRefs[index].current.swipe(dir) // Swipe the card!
    }
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h1>Moogie Match</h1>
      <div className='cardContainer'>
        {movies.map((movie, index) =>
          <TinderCard ref={childRefs[index]} className='swipe' key={movie.name} onSwipe={(dir) => swiped(dir, movie)} onCardLeftScreen={() => outOfFrame(movie.name)} preventSwipe={['down', 'up']}>
            <div style={{ backgroundImage: 'url(' + movie.url + ')' }} className='card'>
              {/* <h3>{movie.name}</h3> */}
            </div>
          </TinderCard>
        )}
      </div>
      {lastDirection ? <h2 key={lastDirection} className='infoText'>You swiped {lastDirection}</h2> : <h2 className='infoText'></h2>}
      <h2 className='infoText'>Code to join: {props.code}</h2>
      <button onClick={()=>{alert(`
        Swipe:
        - Right to like
        - Left to dislike
        - Down for a descripton
        - Up for a list of matches

        Note: In order for there to be a match all members must swipe right on the same film.
        `)}}>Instructions</button>
    </div>
  )
}

export default Advanced
