//required
const dotenv = require('dotenv').config();
const fs = require('fs');
const request = require('request');
const moment = require('moment');
const nodeSpotifyApi = require('node-spotify-api');
const keys = require('./keys.js');

//keys
const bandApi = keys.band.id;
const spotify = new nodeSpotifyApi({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
const omdbApi = keys.omdb.key;

//command line input
let liriArgs = process.argv;
let liriCommand = process.argv[2];
let liriParam = liriArgs.slice(3).join(' ');

//function to append log.txt file
function logtxt(output) {
    fs.appendFile(`log.txt`, `${liriCommand} ${liriParam}\n${output}\n\n`, `utf8`, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Content Added!");
        }
    });
}

//function for concert-this command
function concertThis(artist) {
    const queryUrl = `https://rest.bandsintown.com/artists/${artist}/events?app_id=${bandApi}`;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const event = JSON.parse(body)[0];
            const output = `Name of Venue: ${event.venue.name}\nVenue Location: ${event.venue.city}\nDate of Event: ${moment(event.datetime).format("MM/DD/YYYY")}`;
            console.log(output);
            logtxt(output);

        }
    });
}

//function for spotify-this-song command
function spotifyThisSong(song) {
    if (!song) {
        song === `The Sign by Ace of Base`;
    }
    spotify.search({ type: `track`, query: song, limit: 10 }, function (err, data) {
        const output = `Artist(s): ${data.tracks.items[0].album.artists[0].name}\nSong Name: ${data.tracks.items[0].name}\nPreview URL: ${data.tracks.items[0].href}\nAlbum Name: ${data.tracks.items[0].album.name}`;
        console.log(output);
        logtxt(output);
    });
}

//function for movie-this command
function movieThis(movie) {
    if (!movie) {
        movie === `Mr. Nobody`;
    }

    const queryUrl = `http://www.omdbapi.com/?t=${movie}&y=&plot=short&apikey=${omdbApi}`;

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            const movieObj = JSON.parse(body);
            const output = `Title: ${movieObj.Title}\nYear: ${movieObj.Released}\nIMDB rating: ${movieObj.Ratings[0].Value}\nRotten Tomatoes rating: ${movieObj.Ratings[1].Value}\nLanguage: ${movieObj.Language}\nMovie Plot: ${movieObj.Plot}\nActors: ${movieObj.Actors}`;
            console.log(output);
            logtxt(output);
        }

    });

}

//function for do-what-it-says command
function doWhatItSays() {
    fs.appendFile(`log.txt`, `${liriCommand}\n`, `utf8`, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Content Added!");
        }
    });
    const readFileArray = fs.readFileSync(`random.txt`).toString().split(',');
    const command = readFileArray[0];
    const paramater = readFileArray[1].replace(/["]/g, "");
    console.log(command, paramater);

    heyLiri(command, paramater);

}

function heyLiri(command, param) {
    switch (command) {
        case `concert-this`:
            concertThis(param);
            break;
        case `spotify-this-song`:
            spotifyThisSong(param);
            break;
        case `movie-this`:
            movieThis(param);
            break;
        case `do-what-it-says`:
            doWhatItSays();
            break;
    }
}

heyLiri(liriCommand, liriParam);
