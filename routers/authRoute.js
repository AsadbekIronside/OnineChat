var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });

//AuthControllerHelper

var authController = require('../controllers/AuthController');

module.exports = function (app) {
	
	function isUserAllowed(req, res, next) {
		sess = req.session;
		if (sess.user) {
			  return next();
		}
		else { res.redirect('/login'); }
    }

	// Inner Auth
	app.get('/pages-login', authController.pages_login);
	app.get('/pages-register', authController.pages_register);
	app.get('/pages-recoverpw', authController.pages_recoverpw);
	     ///lock screen
    app.get('/pages-lock-screen', isUserAllowed, authController.pages_lock_screen);

	app.get('/register', authController.register);
	app.post('/post-register', urlencodeParser, authController.post_register);

	app.get('/login', authController.login);
	app.post('/post-login', urlencodeParser, authController.post_login);

	app.get('/forgot-password', authController.forgot_password);
	app.post('/post-forgot-password', urlencodeParser, authController.post_forgot_password);

	app.get('/logout', authController.logout);
     
	app.get('/delete-user', urlencodeParser, isUserAllowed, authController.deleteUser);

	//// page-unlock
	app.post('/page-unlock', urlencodeParser, isUserAllowed, authController.page_unlock);

};

