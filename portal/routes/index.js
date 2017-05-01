var express = require('express');
var request = require('request');
var router = express.Router();
var address = 'http://54.193.44.42:8000'


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
				"size": req.body.size
			}
		]
	};
	var hostname = (req.body.shopname=='SF')? "portal.com" : "sj.com";
	console.log("hostname"+ hostname);
	var options = {
	  method: 'post',
	  json: order,
	  url: address + "/"+req.body.shopname + "/starbucks/order",
	  headers: {
	    'Host': hostname
	  }
	}
	request(options,function (error, response, body) {
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