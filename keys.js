
// having trouble here
// var spotify = new Spotify(keys.spotify);

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
  };
  var spotifyKeys = {
	id: "2a456a2b2baa4a309109e55e9fd57895",
	secret: "f1db04b16f4941358427c567429684fa"
}
  module.exports = {
	spotifyKeys: spotifyKeys
}