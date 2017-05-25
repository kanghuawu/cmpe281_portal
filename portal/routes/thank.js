var express = require('express');
var request = require('request');
var router = express.Router();
var address = 'http://54.193.44.42:8000'


router.get('/', function(req, res, next) {
	res.render('thank');
})