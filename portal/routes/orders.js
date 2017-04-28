var express = require('express');
var request = require('request');
var router = express.Router();
var address = 'http://127.0.0.1:9090/v3/starbucks/orders'

router.get('/', function(req, res, next) {
	request.get(
		address,
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				// console.log(body);
				res.render('orders', { orders: JSON.parse(body) });
			}
		}
	);
})

module.exports = router;