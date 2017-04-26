var express = require('express');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('order');
});

router.post('/', function(req, res, next) {
	console.log(req.body)
	var order = {
		"location": req.body.location,
		"items": [
			{
				"qty": req.body.qty,
				"name": req.body.name,
				"milk": req.body.milk,
				"size": req.body.size
			}
		]
	};
	request.post(
		'http://localhost:9090/v3/starbucks/order',
		{ json: order },
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body)
			}
		}
	);
	console.log("Placing order", JSON.stringify(order));

	res.render('order');
});

// router.get('/:orderid', function(req, res, next) {
// 	res.send(req.params.orderid);
// });

module.exports = router;
