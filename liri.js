var dotenv = require("dotenv").config();
var request = require("request");
var spotifyReq = require("node-spotify-api");
var keys = require("./keys.js");
var fs = require("fs");
var args = process.argv.slice(2);

var command = args[0];
var userInput = args.slice(1).join(" ");


function searchSong(searchValue) {

    // Default search value if no song is given
    if (searchValue == "") {
        searchValue = "It wasn't me";
    }

    // Accesses Spotify keys  
    var spotify = new Spotify(keys.spotify);

    var searchLimit = "";

    // Allows the user to input the number of returned spotify results, defaults 1 return if no input given
    if (isNaN(parseInt(process.argv[3])) == false) {
        searchLimit = process.argv[3];

        console.log("\nYou requested to return: " + searchLimit + " songs");
        
        // Resets the searchValue to account for searchLimit
        searchValue = "";
        for (var i = 4; i < process.argv.length; i++) {        
            searchValue += process.argv[i] + " ";
        };

    } else {
        console.log("\nFor more than 1 result, add the number of results you would like to be returned after spotify-this-song.\n\nExample: if you would like 3 results returned enter:\n     node.js spotify-this-song 3 Kissed by a Rose")
        searchLimit = 1;
    }
   
    // Searches Spotify with given values
    spotify.search({ type: 'track', query: searchValue, limit: searchLimit }, function(respError, response) {

        fs.appendFile("log.txt", "-----Spotify Log Entry Start-----\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n", errorFunctionStart());

        errorFunction();

        var songResp = response.tracks.items;

        for (var i = 0; i < songResp.length; i++) {
            console.log("\n=============== Spotify Search Result "+ (i+1) +" ===============\n");
            console.log(("Artist: " + songResp[i].artists[0].name));
            console.log(("Song title: " + songResp[i].name));
            console.log(("Album name: " + songResp[i].album.name));
            console.log(("URL Preview: " + songResp[i].preview_url));
            console.log("\n=========================================================\n");

            fs.appendFile("log.txt", "\n========= Result "+ (i+1) +" =========\nArtist: " + songResp[i].artists[0].name + "\nSong title: " + songResp[i].name + "\nAlbum name: " + songResp[i].album.name + "\nURL Preview: " + songResp[i].preview_url + "\n=============================\n", errorFunction());
        }

        fs.appendFile("log.txt","-----Spotify Log Entry End-----\n\n", errorFunctionEnd());
    })
};

// ++++++++++++++++++++ OMDB movie-this +++++++++++++++++++++++++
function searchMovie(searchValue) {

    // Default search value if no movie is given
    if (searchValue == "") {
        searchValue = "Sully";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + searchValue.trim() + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(respError, response, body) {

        fs.appendFile("log.txt", "-----OMDB Log Entry Start-----\n\nProcessed on:\n" + Date() + "\n\n" + "terminal commands:\n" + process.argv + "\n\n" + "Data Output: \n\n", errorFunctionStart());

        errorFunction();

        if (JSON.parse(body).Error == 'Movie not found!' ) {

            console.log("\n I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n")

            fs.appendFile("log.txt", "I could not find any movies that matched the title " + searchValue + ". Please check your spelling and try again.\n\n-----OMDB Log Entry End-----\n\n", errorFunctionEnd());
        
        } else {

            movieBody = JSON.parse(body);

            console.log("\n++++++++++++++++ OMDB Search Results ++++++++++++++++\n");
            console.log("Movie Title: " + movieBody.Title);
            console.log("Year: " + movieBody.Year);
            console.log("IMDB rating: " + movieBody.imdbRating);

            // If there is no Rotten Tomatoes Rating
            if (movieBody.Ratings.length < 2) {

                console.log("There is no Rotten Tomatoes Rating for this movie.")

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: There is no Rotten Tomatoes Rating for this movie \nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunction());
                
            } else {

                console.log("Rotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value);

                fs.appendFile("log.txt", "Movie Title: " + movieBody.Title + "\nYear: " + movieBody.Year + "\nIMDB rating: " + movieBody.imdbRating + "\nRotten Tomatoes Rating: " + movieBody.Ratings[[1]].Value + "\nCountry: " + movieBody.Country + "\nLanguage: " + movieBody.Language + "\nPlot: " + movieBody.Plot + "\nActors: " + movieBody.Actors + "\n\n-----OMDB Log Entry End-----\n\n", errorFunction());
            }
            
            console.log("Country: " + movieBody.Country);
            console.log("Language: " + movieBody.Language);
            console.log("Plot: " + movieBody.Plot);
            console.log("Actors: " + movieBody.Actors);
            console.log("\n+++++++++++++++++++++++++++++++++++++++++++++++++\n");
            console.log("xxxx Log Ended xxxx");
        };      
    });
};

// xxxxxxxxxxxxxxxxxx Random do-what-it-says xxxxxxxxxxxxxxxxxxxxxx
function randomSearch() {

    fs.readFile("random.txt", "utf8", function(respError, data) {

        var randomArray = data.split(", ");

        errorFunction();

        if (randomArray[0] == "spotify-this-song") {
            searchSong(randomArray[1]);
        } else if (randomArray[0] == "movie-this") {
            searchMovie(randomArray[1]);
        } 
    });
};


// Runs corresponding function based on user command
switch (command) {
    
    case "spotify-this-song":
        searchSong(searchValue);
        break;
    case "movie-this":
        searchMovie(searchValue);
        break;
    case "do-what-it-says":
        randomSearch();
        break;
    default:
        console.log("\nI'm sorry, " + command + " is not a command that I recognize. Please try one of the following commands: \n\n  1. For a random search: node liri.js do-what-it-says \n\n  2. To search a movie title: node liri.js movie-this (with a movie title following) \n\n  3. To search Spotify for a song: node liri.js spotify-this-song (*optional number for amount of returned results) (specify song title)\n     Example: node liri.js spotify-this-song 15 Candle in the Wind\n\n  4. To see the last 20 of Aidan Clemente's tweets on Twitter: node liri.js my-tweets \n");
};
// ////////////////////////////////////////////////////////DO I NEED THIS

//  if (command === "spotify-this-song") {
// 	spotifyThis();
// } else if (command === "movie-this") {
// 	movieThis();
// } else if (command === "do-what-it-says") {
// 	fileSaysDo();
// } else {
// 	console.log("I'm sorry, I don't understand. Please tell me a command: \nspotify-this-song \nmovie-this \ndo-what-it-says");
// }


function spotifyThis() {
	var isInputNull = userInput === "" ? userInput = "CSS Sucks" : userInput = userInput;
	var spotify = new spotifyReq(keys.spotifyKeys);

	spotify.search({
		type: "track",
		query: userInput,
		limit: 1
	}, function(err, data) {
		if (err) {
			return console.log(err);
		} else {
			console.log("Artist: " + data.tracks.items[0].album.artists[0].name); // artist's name
			console.log("Song name: " + data.tracks.items[0].name) // song name
			console.log("External url: " + data.tracks.items[0].album.external_urls.spotify) // external link
			console.log("Album: " + data.tracks.items[0].album.name) // album name
		}

		fs.appendFile("log.txt", "\nAppending this song and artist data: " + 
			"\n" + data.tracks.items[0].album.artists[0].name + 
			"\n" + data.tracks.items[0].name + 
			"\n" + data.tracks.items[0].album.external_urls.spotify + 
			"\n" + data.tracks.items[0].album.name, function(err) {
				if (err) {
					console.log(err);
				}
			})
	})
}

function movieThis() {
	var isInputNull = userInput === "" ? userInput = "Old School" : userInput = userInput;
	var queryUrl = "http://www.omdbapi.com/?t=" + userInput + "&y=&plot=full&tomatoes=true&apikey=trilogy";

	request(queryUrl, function(err, response, body) {
		if (err) {
			return console.log(err);
		} else {
			var rottenExists = JSON.parse(body).Ratings[1] === undefined ? rottenExists = "N/A" : rottenExists = JSON.parse(body).Ratings[1].Value;
			console.log("Title: " + JSON.parse(body).Title);
			console.log("Year: " + JSON.parse(body).Year);
			console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
			console.log("Rotten Tomatoes Rating: " + rottenExists);
			console.log("Country: " + JSON.parse(body).Country);
			console.log("Language: " + JSON.parse(body).Language);
			console.log("Plot: " + JSON.parse(body).Plot);
			console.log("Actors: " + JSON.parse(body).Actors);	
		}

		fs.appendFile("log.txt", "\n" + "Appending this movie information: " + 
			"\n" + JSON.parse(body).Title + "\n" + JSON.parse(body).Year + 
			"\n" + JSON.parse(body).imdbRating + "\n" + JSON.parse(body).rottenExists +
			"\n" + JSON.parse(body).Country + "\n" + JSON.parse(body).Language +
			"\n" + JSON.parse(body).Plot + "\n" + JSON.parse(body).Actors, function(err) {
				if (err) {
					console.log(err);
				}
			})
	})
}

function fileSaysDo() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		} else {
			var dataArr = data.split(",");
			userInput = dataArr[1];
			command = dataArr[0];

        }
        if (command === "spotify-this-song") {
				spotifyThis();
			} else {
				movieThis();
            }
        
		

		fs.appendFile("log.txt", "User engaged the random file.", function(err) {
			if (err) {
				console.log(err);
			}
		})
	});
}