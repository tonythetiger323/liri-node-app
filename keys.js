const spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
};

const band = {
    id: process.env.BAND_APP_ID
};

const omdb = {
    key: process.env.OMDB_KEY
};

module.exports = { spotify, band, omdb };