var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql= require('mysql');
var http = require('http');
var app = express();
var timestamp = require('time-stamp');
var rn = require('random-number');
var options = {
  min:  0
, max:  99999
, integer: true
}
// view engine setup
app.set('json spaces', 40);


//Database connection
app.use(function(req, res, next){
	global.connection = mysql.createConnection({//
	  	host     : 'localhost',
	  	user     : 'root',
		password : 'root',
  		database : 'mysql'
	});
	connection.connect();
	next();
});
// Calling Service
app.get('/mysql', (function(req, res, next) {
	if(req.query.FLAG == 1)
	{
	connection.query("SELECT * FROM QUICK_RUSH", function (err, result, fields) {
					if (err) throw err;
					console.log(result);
					res.json(result);
					});
	}
	else if (req.query.FLAG == 2 && req.query.BOOKING_ID != null) 
	{
		var time = timestamp('YYYYMMDD');
		var booking = rn(options);
		var sql = "INSERT INTO QUICK_RUSH (BOOKING_ID, ORDER_ID, EMP_ID, ITEM, TIMESTAMP, AMOUNT) VALUES (?,?,?,?,?,?)";
		connection.query(sql,[booking, req.query.ORDER_ID, req.query.EMP_ID, req.query.ITEM,time, req.query.AMOUNT ],
		function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
	res.send(200);	
  });
	}
	else
	res.send(404);	
}));
module.exports = app;
var server = http.createServer(app);
server.listen(4001);
