var express = require('express');
var request = require('request');
var router = express.Router();
var address = 'http://54.193.44.42:8000';

router.get('/', function(req, res, next) {
	res.send({'message': 'order error' });
})


router.get('/:order_id', function(req, res, next) {
	console.log('order with id ', req.params.order_id);
	var options = {
	  method: 'get',
	  json: true,
	  url: address + "/SF/starbucks/order/" + req.params.order_id,
	  headers: {
	    'Host': 'portal.com'
	  }
	}
	console.log(options.url);
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
				console.log(body);
				//console.log( JSON.parse(body));
				// res.send({'message': 'order test' });
				res.render('order', { order: body});
		}
	});
});

// router.get('/:orderid', function(req, res, next) {
// 	res.send(req.params.orderid);
// });




module.exports = router;
