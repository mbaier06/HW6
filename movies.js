// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL

window.addEventListener('DOMContentLoaded', async function(event) {
  let db = firebase.firestore()

  // Step 1: Construct a URL to get movies playing now from TMDB, fetch
  // data and put the Array of movie Objects in a variable called
  // movies. Write the contents of this array to the JavaScript
  // console to ensure you've got good data
  // ⬇️ ⬇️ ⬇️
  let apiKey = '930dfd83a5eca2f4daa4014bcba9d8e7'
  let response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`)
  let json = await response.json()
  // console.log(json)
  let movies = json.results
  console.log(movies)
  // ⬆️ ⬆️ ⬆️ 
  // End Step 1
  
  // Step 2: 
  // - Loop through the Array called movies and insert HTML
  //   into the existing DOM element with the class name .movies
  // - Include a "watched" button to click for each movie
  // - Give each "movie" a unique class name based on its numeric
  //   ID field.
  // Some HTML that would look pretty good... replace with real values :)
  // <div class="w-1/5 p-4 movie-abcdefg1234567">
  //   <img src="https://image.tmdb.org/t/p/w500/moviePosterPath.jpg" class="w-full">
  //   <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
  // </div>
  // ⬇️ ⬇️ ⬇️

  let querySnapshot = await db.collection('movies').get()
  console.log(querySnapshot.size)

  let watchedMovies = querySnapshot.docs
  console.log(watchedMovies)
  
    // Second part of Step 4
    // - Modify the code you wrote in Step 2 to conditionally
    //   make the movie opaque if it's already watched in the 
    //   database.
    // - Hint: you can use if (document) with no comparison
    //   operator to test for the existence of an object
    for (i = 0; i < movies.length; i++){
      movie = movies[i]
      // console.log(movie)
      let movieId = movie.id 
      // console.log(movieId)
      let poster_path = movie.poster_path
      let moviePosterPath = `https://image.tmdb.org/t/p/w500${poster_path}`
      document.querySelector('.movies').insertAdjacentHTML('beforeend', `
      <div class="w-1/5 p-4 movie-${movieId}">
        <img src="${moviePosterPath}" class="w-full">
        <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      </div>
      `)

      for (let dbIndex = 0; dbIndex < watchedMovies.length; dbIndex++) {
        watchedMovie = watchedMovies[dbIndex]
        // setting duplicative movie ID variable to map DB doc ID with json array movie IDs for if statement below
        watchedMovieId = watchedMovie.id
        // console.log(watchedMovieId)
        if (watchedMovieId == movieId) {
          document.querySelector(`.movie-${movieId}`).classList.add('opacity-20')
        } else {}
      }

  // ⬆️ ⬆️ ⬆️ 
  // End Step 2

  // Step 3: 
  // - Attach an event listener to each "watched button"
  // - Be sure to prevent the default behavior of the button
  // - When the "watched button" is clicked, changed the opacity
  //   of the entire "movie" by using .classList.add('opacity-20')
  // - When done, refresh the page... does the opacity stick?
  // ⬇️ ⬇️ ⬇️
   let watchButton = document.querySelector(`.movie-${movieId} .watched-button`)
   watchButton.addEventListener('click', async function(event){
     event.preventDefault()
     console.log(`I watched ${movieId}!`)
    document.querySelector(`.movie-${movieId}`).classList.add('opacity-20')

  // - Bonus challenge: add code to "un-watch" the movie by using .classList.contains('opacity-20') to check if 
  //   the movie is watched. Use .classList.remove('opacity-20')
  //   to remove the class if the element already contains it.
    // Un-watch logic (although doesnt persist upon page refresh since not properly hooked to DB to delete Doc ID):
    // if (document.querySelector(`.movie-${movieId}`).classList.contains('opacity-20')) {
    //   await db.collection('movies').doc(`${movieId}`).delete();
    //   document.querySelector(`.movie-${movieId}`).classList.remove('opacity-20');
    // } else {}

    // Step 4: 
    // - Properly configure Firebase and Firebase Cloud Firestore --- done in HTML file
    // - Inside your "watched button" event listener, you wrote in
    //   step 3, after successfully setting opacity, persist data
    //   for movies watched to Firebase.
    // - The data could be stored in a variety of ways, but the 
    //   easiest approach would be to use the TMDB movie ID as the
    //   document ID in a "watched" Firestore collection.
    // - Hint: you can use .set({}) to create a document with
    //   no data – in this case, the document doesn't need any data;
    //   if a TMDB movie ID is in the "watched" collection, the 
    //   movie has been watched, otherwise it hasn't.

    await db.collection('movies').doc(`${movieId}`).set({})
    })
  }
  // ⬆️ ⬆️ ⬆️ 
  // End Step 3

})