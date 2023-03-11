'use strict';

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

var path = require('path');
var fs = require('fs');

function pruebas(req, res) {
	return res.status(200).send({
		message: 'Probando una acción del controlador de usuarios del api rest con Node y Mongo'
	});
}

function saveUser(req, res) {

	var user = new User();
	var params = req.body;

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if (params.password) {

		//encriptar contraseña

		bcrypt.hash(params.password, null, null, function (err, hash) {

			user.password = hash;

			if (user.name != null && user.surname != null && user.email != null) {

				user.save((err, userStored) => {
					if (err) {
						res.status(200).send("Rellena los campos");
					} else {

						if (!userStored) {

							res.status(404).send({
								message: 'No se ha registrado el usuario'
							});

						} else {

							res.status(201).send({
								user: userStored
							});

						}
					}

				});
			}
		});

	} else {
		res.status(500).send({
			message: 'Hubo un problema en la aplicación, Rellena bien los campos del formulario'
		});
	}
}

function loginUser(req, res) {

	var params = req.body;
	
	var email = params.email;
	var password = params.password;

	User.findOne({
		email: email.toLowerCase()
	}, (err, user) => {
		if (err) {
			res.status(500).send({message: 'Error en la petición'});
		} else {
			if (!user) {
				res.status(404).send({message: 'El usuario no existe'});
			} else {
				bcrypt.compare(password, user.password, function (err, check) {
					if (check) {
						if (params.gethash) {
							//devolver un token jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});
						} else {
							res.status(200).send({user});
						}
					} else {
						res.status(404).send({message: "El usuario no ha podido loguearse"});
					}
				});
			}
		}
	});

}

function updateUser(req, res) {

	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.usersub) {
		return res.status(500).send({message: 'No estás autorizado'});
	}

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {

		if (err) {
			res.status(500).send({
				message: 'Error al actualizar el usuario'
			});
		} else {
			if (!userUpdated) {
				res.status(404).send({
					message: 'El usuario no se ha podida actualizar'
				});
			} else {
				res.status(200).send({
					message: 'El usuario se ha actualizado',
					user: userUpdated
				});
			}
		}
	});
}

function uploadImage(req, res) {
	var userId = req.params.id;
	var file_name = 'imagen no subida';

	if (req.files) {

		var file_path = req.files.image.path;
		var file_split = file_path.split('/');
		var file_name = file_split[5];

		var ext_split = file_name.split('.');
		var file_ext = ext_split[1];

		console.log(ext_split)
		console.log(file_name)
		console.log(file_ext)
		console.log(file_split)

		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif' || file_ext == 'jpeg') {
			User.findByIdAndUpdate(userId, { image: file_name }, (err, userUpdated) => {
				if (!userUpdated) {
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				} else {
					res.status(200).send({image: file_name, user: userUpdated});
				}
			});
		} else {
			res.status(200).send({
				message: 'Extensión del archivo no válido'
			});
		}
	} else {
		res.status(200).send({
			message: 'No has subido ninguna imagen'
		});
	}



}

function getImageFile(req, res) {

	var imageFile = req.params.imageFile;
	var path_file = './../uploads/users/'+imageFile;

	if (fs.exists) {
		res.sendFile(path.resolve(__dirname + path_file));
	} else {
		res.status(200).send({
			message: 'No existe la imagen'
		});
	}
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};