// app/routes.js


module.exports = function(app, passport,fs,request,hostname,dataconfig) {


    //loading all feature toggles

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('home.ejs',{  user : req.user }); // load the index.ejs fi
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user, // get the user out of session and pass to template
            pageTitle: 'Profile Page'
        });
    });

    app.get('/stores',  isLoggedIn , function(req, res) {
        res.render('stores.ejs',{ user : req.user, data: dataconfig });
    });

    app.post('/placeOrder', isLoggedIn, function(req, res) {
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
      var hostnam = (req.body.shopName=='SF')? "portal.com" : "sj.com";
      console.log("hostname"+ hostname.address);
      var options = {
        method: 'post',
        json: order,
        url: hostname.address + "/"+req.body.shopName + "/starbucks/order",
        headers: {
          'Host': (req.body.shopName=='SF')? "portal.com" : "sj.com"
        }
      }
      request(options,function (error, response, body) {
          if (!error && response.statusCode == 200) {
            console.log("response::::: "+JSON.stringify(response.body));
            res.render('myorder.ejs',  {user : req.user, order:response.body,data:dataconfig,hostname:hostname,shopName:req.body.shopName});
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

    app.post('/cancelOrder',isLoggedIn, function(req,res){
        console.log(req.body);
        var hostnam = (req.body.shopName=='SF')? "portal.com" : "sj.com";
        console.log("hostname"+ hostname.address);
        var options = {
          method: 'delete',
          url: hostname.address + req.body.orderLink,
          headers: {
            'Host': (req.body.shopName=='SF')? "portal.com" : "sj.com"
          }
        }
        console.log(options);
        request(options,function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log("response::::: "+JSON.stringify(response.body));
              res.render('stores.ejs',  { user : req.user, data: dataconfig });
            }else{
              console.log(response.statusCode);
              console.log(error);
              res.end(JSON.stringify(response.message));
            }
          }
        );
       //console.log(res.body);

    });

    app.post('/payOrder',isLoggedIn, function(req,res){
        console.log(req.body);
        var hostnam = (req.body.shopName=='SF')? "portal.com" : "sj.com";
        console.log("hostname"+ hostname.address);
        var options = {
          method: 'post',
          url: hostname.address + req.body.payLink,
          headers: {
            'Host': (req.body.shopName=='SF')? "portal.com" : "sj.com"
          }
        }
        console.log(options);
        request(options,function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log("response::::: "+JSON.stringify(response.body));
              res.render('thanks.ejs',  { user : req.user});
            }else{
              console.log(response.statusCode);
              console.log(error);
              res.end(JSON.stringify(response.message));
            }
          }
        );
       //console.log(res.body);

    });
    app.get('/myorders',isLoggedIn, function(req,res){
      res.render('myorders.ejs',{  user : req.user,orders:[],itemSelected:'' })
    });

    app.post('/myorders',isLoggedIn, function(req,res){
        var hostnam = req.body.location;
        var contextroot =  (req.body.location=='sj.com') ? "/SJ/starbucks/orders" : "/SF/starbucks/orders";
        console.log("hostname"+ hostname.address);
        var options = {
          method: 'get',
          url: hostname.address + contextroot,
          headers: {
            'Host': hostnam
          }
        }
        console.log(options);
        request(options,function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(typeof response.body);
              res.render('myorders.ejs',{user : req.user,orders:JSON.parse(response.body),itemSelected:req.body.location});
            }else{
              console.log(response.statusCode);
              console.log(error);
              res.end(JSON.stringify(response.message));
            }
          }
        );
       //console.log(res.body);

    });
    app.post('/updateOrder',isLoggedIn, function(req,res){
        console.log(req.body);
        var hostnam = (req.body.shopName=='SF')? "portal.com" : "sj.com";
        console.log("hostname"+ hostname.address);
        var newOrder = {
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
        var options = {
          method: 'put',
          json: newOrder,
          url: hostname.address + req.body.orderLink,
          headers: {
            'Host': (req.body.shopName=='SF')? "portal.com" : "sj.com"
          }
        }
        console.log(options);
        request(options,function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log("response::::: "+JSON.stringify(response.body));
              res.render('myorder.ejs',  {user : req.user, order:response.body,data:dataconfig,hostname:hostname,shopName:req.body.shopName});
            }else{
              console.log(response.statusCode);
              console.log(error);
              res.end(JSON.stringify(response.message));
            }
          }
        );
       //console.log(res.body);

    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
