var express = require('express');
var request = require('request');
var router = express.Router();
var address = 'http://54.215.214.142:9090/v3/starbucks/order'

router.get('/', function(req, res, next) {
	res.send({'message': 'order error' });
})

router.get('/:order_id', function(req, res, next) {
	console.log('order with id ', req.params.order_id)
	request.get(
		address + '/' + req.params.order_id,
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log(body);
				// res.send({'message': 'order test' });
				res.render('order', { order: JSON.parse(body) });
			}
		}
	);
});

// router.get('/:orderid', function(req, res, next) {
// 	res.send(req.params.orderid);
// });



module.exports = router;
