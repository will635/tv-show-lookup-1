// initialize page after HTML loads
window.onload = function () {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// get data from TV Maze
function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  
  var search = document.getElementById("search").value;  
    
  fetch('http://api.tvmaze.com/search/shows?q=' + search)
    .then(response => response.json())
    .then(data => showSearchResults(data) 
    );
} // window.onload 
 

// change the activity displayed 
function showSearchResults(data) {
  
  // show data from search
  console.log(data); 
  
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for


} // updatePage

// in the json, genres is an array of genres associated with the tv show 
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   var g;
   var output;
   if (genres.length > 0) {
    output = "<ul>";
    for (g in genres) {
        output += "<li>" + genres[g] + "</li>"; 
    } // for       
    output += "</ul>";
  } else {
    output = "No genres availabile sorry."
  }
  return output;
} // showGenres

// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
  
    // get the main div tag
    var elemMain = document.getElementById("main");
    
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
    
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
    
    var elemGenre = document.createElement("div");
    var elemRating = document.createElement("div");
    var elemSummary = document.createElement("div");
    
    // add JSON data to elements
    if (tvshowJSON.show.image != null) {
      elemImage.src = tvshowJSON.show.image.medium;
    }
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    if (tvshowJSON.show.genres.length > 0) {
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    } else {
      elemGenre.innerHTML = showGenres(tvshowJSON.show.genres);
    }
    if (tvshowJSON.show.rating.average != null) {
      elemRating.innerHTML = "Rating: " + tvshowJSON.show.rating.average;
    } else {
      elemRating.innerHTML = "<br> No rating availible sorry. You could be the first to rate it!"
    }
    if (tvshowJSON.show.summary != null) {
      elemSummary.innerHTML = tvshowJSON.show.summary;
    }
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
    
    // get id of show and add episode list
    var showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
    
    // add this tv show to main
    elemMain.appendChild(elemDiv);
    
} // createTVShow

// fetch episodes for a given tv show id
function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
  
  fetch('http://api.tvmaze.com/shows/' + showId + '/episodes')  
    .then(response => response.json())
    .then(data => showEpisodes(data, elemDiv));
    
} // fetch episodes

// list all episodes for a given showId in an ordered list 
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
  
    // print data from function fetchEpisodes with the list of episodes
    console.log("episodes");
    console.log(data); 
    var elemEpisodes = document.createElement("div");  // creates a new div tag
    
  if (data.length > 0) {
      var output = "<hr> Episodes: <ol>";
      for (episode in data) {
          output += "<li onclick='fetchEpisodeData(" + data[episode].id + ")'><a>" + data[episode].name + "</a></li>";
        //output += "<li onclick='showLightBox(" + data[episode].id + ")'><a>" + data[episode].name + "</a></li>";
      }
      output += "</ol>";
  } else {
    var output = "<hr> <h4>No episodes yet.</h4>";
  }
  elemEpisodes.innerHTML = output;
  elemDiv.appendChild(elemEpisodes);  // add div tag to page
} // showEpisodes
// open lightbox and display episode info


function fetchEpisodeData(episodeId) {
  fetch('http://api.tvmaze.com/episodes/' + episodeId)  
  .then(response => response.json())
  .then(data => showLightBox(data));
}

function showLightBox(episodeData){

    document.getElementById("message").innerHTML = "<p>Sorry there isn't anything for this episode yet.</p>";
     document.getElementById("lightbox").style.display = "block";
     
     // show episode info in lightbox
     let img = true;
     if (episodeData.image != null) {
      document.getElementById("message").innerHTML = "<img src='" + episodeData.image.medium + "'>";
      img = true;
    } else {
      document.getElementById("message").innerHTML = "<h3>Episode Name: " + episodeData.name + "</h3>";
      img = false;
    }
     if (img) {
      document.getElementById("message").innerHTML += "<h3>Episode Name: " + episodeData.name + "</h3>";
     }
      document.getElementById("message").innerHTML += "<p>Season: " + episodeData.season + "</p>";
      document.getElementById("message").innerHTML += "<p>Episode Number: " + episodeData.number + "</p>";
    if (episodeData.summary == "" || episodeData.summary == null) {
      document.getElementById("message").innerHTML += "<p></p>"
    } else {
      document.getElementById("message").innerHTML += "<p>" + episodeData.summary + "</p>";
    }
    
} // showLightBox

 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox 






