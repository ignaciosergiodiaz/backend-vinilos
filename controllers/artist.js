' use strict ' ;

var path = require('path');
var fs = require('fs');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res){

    const artistId = req.params.id ;

    Artist.findById(artistId, (err, artist) => {

        if (err){
            res.status(500).send({message:'Error en la petición'});
        } else {
            if(!artist){
                res.status(404).send({message:'El artista no existe'});
            }else{
                res.status(200).send({artist});
            }
        }

    });
}

function getArtists(req,res){

    if(req.params.page){
        var page = req.params.page;
    }else{
        var page = 1 ;
    }

    var itemsPerPage = 4  ;
  
    Artist.find({}).sort('name').paginate(page, itemsPerPage, function(err, artists, total){

        if(err){
            res.status(500).send({message: 'Error en la aplicación'});
        }else{
            if(!artists){
                res.status(404).send({message:'No hay artistas'});
            }else{
                return res.status(200).send({
                    pages:total,
                    artists: artists
                });
            }
        }
    });
}

function saveArtist(req, res){
    
    var artist = new Artist();
    var params = req.body;
    
    artist.name = req.body.name;
    artist.description = params.desceription;
    artist.image = params.path_file ;

    artist.save((err, artist) => {
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!artist){
                res.status(404).send({message:'El artista no ha sido guardado'});
            }else{
                res.status(200).send({artist});
                console.log(artist)
            }
        }
    });
}

function updateArtist(req, res ){

    var artistId = req.params.id ;
    var update = req.body ;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Error al actualizar el artista'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message:'El artista no ha sido actualizado'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteArtist(req, res) {

    var artistId = req.params.id;
    
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            return  res.status(500).send({message: 'Error al eliminar el artista'});
        }else{
            if(!artistRemoved){
              return  res.status(404).send({message:'El artista no ha sido actualizado'});
            }else{
                
              return   res.status(404).send({message:'El artista ha sido eliminado para siempre'});

            }
        }
    });
}

function uploadImage(req, res) {

    var artistId = req.params.id;
    var file_name = 'No subido...';

    if(req.files){

        var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[6];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		console.log(ext_split)
		console.log(file_name)
		console.log(file_ext)
		console.log(file_split)

		if(file_ext  == 'png' || file_ext == 'jpg' || file_ext  == 'gif' || file_ext  == 'jpeg')
		{
			Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
				
				if(!artistUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				} else {
					res.status(200).send({artist: artistUpdated});
				}
			});

		}else{
			res.status(200).send({message: 'Extensión del archivo no válido'});
		} 
	}else{
		res.status(200).send({message: 'No has subido ninguna imagen'});
	}
}

function getImageFile (req, res) {

	var imageFile = req.params.imageFile ; 
	var path_file = './../uploads/artists/'+imageFile ;

	if(fs.exists){ 
		res.sendFile(path.resolve( __dirname + path_file));
	}else{
		res.status(200).send({message: 'No existe la imagen'});
	}
	
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
}