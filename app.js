require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
    res.render('index.hbs');
});

app.get('/artist-search', (req, res, next) => {
    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log('The received data from the API: ', data.body.artists.items.images);
            res.render('artist-search-results.hbs', { results: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            console.log('The received data from the API: ', data.body);
            res.render('albums', { album: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/tracks/:tracksId', (req, res, next) => {
    spotifyApi
        .getAlbumTracks(req.params.tracksId)
        .then(data => {
            console.log('The received data from the API: ', data.body.items);
            res.render('tracks', { tracks: data.body.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
