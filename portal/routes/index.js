var express = require('express');
var request = require('request');
var router = express.Router();
var address = 'http://54.215.214.142:9090/v3/starbucks/order'

router.get('/', function(req, res, next) {
	res.render('index');
})

router.get('/stores', function(req, res, next) {
	res.render('enterOrder');
})

router.post('/placeOrder', function(req, res, next) {
	console.log(req.body);
	var order = {
		"location": req.body.location,
		"items": [
			{
				"qty": req.body.qty,
				"name": req.body.name,
				"milk": req.body.milk,
				"size": req.body.size,
				//"store": req.body.shopname
			}
		]
	};
	request.post(
		address,
		{ json: order },
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log("response::::: "+response.body.id);
				res.redirect('order/' + response.body.id);
				res.end();
			}else{
				console.log(response.statusCode);
				console.log(error);
				res.end(JSON.stringify({'message':'wrong order'}))
			}
		}
	);
	 console.log("Placing order", JSON.stringify(order));
	 //console.log(res.body);
});

module.exports = router;