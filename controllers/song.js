'use strict';

var path = require('path');
var fs = require('fs');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
var mongoosePaginate = require('mongoose-pagination');

function getSong(req, res) {

    var songId = req.params.id;

    Song.findById(songId).populate({
        path: 'album'
    }).exec((err, song) => {

        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if (!song) {
                res.status(404).send({
                    message: 'No existe la canción'
                });
            } else {
                res.status(200).send({
                    song
                });
            }
        }
    });
}

function getSongs(req, res) {

    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({
            album: albumId
        }).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la aplicación'
            });
        } else {
            if (!songs) {
                res.status(404).send({
                    message: 'No hay canciones'
                });
            } else {
                res.status(200).send({
                    songs: songs
                });
            }
        }
    });
}

function saveSong(req, res) {

    var song = new Song();
    var params = req.body;

    var params = req.body;
    
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = '';
    song.album = params.album;

    song.save((err, song) => {

        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if (!song) {
                res.status(404).send({
                    message: 'No se ha guardado la canción'
                });
            } else {
                res.status(200).send({song});
                console.log(req.body)
            }
        }
    });
}

function updateSong(req, res) {

    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, song) => {

        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });

        } else {
            if (!song) {
                res.status(404).send({
                    message: 'No se ha guardado la canción'
                });
            } else {
                res.status(200).send({
                    song
                });
            }
        }
    });
}

function deleteSong(req, res) {

    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {

        if (err) {
            res.status(404).send({
                message: 'No se ha guardado la canción'
            });
        } else {
            if (!songRemoved) {
                res.status(404).send({
                    message: 'No se ha guardado la canción'
                });
            } else {
                res.status(200).send({
                    message: 'No se ha guardado la canción'
                });
            }
        }
    });
}

function uploadFile(req, res) {

    var songId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {

        var file_path = req.files.image.path;
		var file_split = file_path.split('/');

		var file_name = file_split[9];
		/* Obtener la extención */
		var ext_split = file_name.split('.');
		var file_ext = ext_split[0];
		var extencion_archivo = ext_split[1];

		console.log(ext_split)
		console.log(file_name)
		console.log(file_ext)
		console.log(file_split)
		console.log(extencion_archivo)

        if (extencion_archivo == 'mp3' || extencion_archivo == 'wav' ){

        Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {

          if(!songUpdated){
            res.status(404).send({ message: 'No se ha podido actualizar la canción' });
          } else {
            res.status(200).send({album: songUpdated});
          }

        });

      }else{
        res.status(200).send({message: 'Extensión del archivo no es válido'});
      }

      }else{
        res.status(200).send({message: 'No has subido el fichero de audio'});
      }
}

function getSongFile (req, res) {

    var songFile = req.params.songFile ;
    var path_file = './../uploads/songs/' + songFile ;

    if(fs.exists){
    res.sendFile(path.resolve( __dirname + path_file));
    }else{
    res.status(200).send({message: 'No existe el fichero de audio'});
    }
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}