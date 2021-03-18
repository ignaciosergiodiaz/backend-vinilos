' use strict ';

var express = require('express');
var SongController = require('./../controllers/song');
var api = express.Router();
var md_auth = require('./../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_upload = multipart({
    uploadDir: __dirname + './../uploads/songs'
});

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.post('/song', md_auth.ensureAuth, SongController.saveSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);

api.post('/upload-song-album/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-album/:songFile', SongController.getSongFile);

module.exports = api;