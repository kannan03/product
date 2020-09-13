
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');
var express = require('express');
var cookieParser = require('cookie-parser');
const session = require('express-session');
var app = express();
const axios = require('axios');
var port = 5555;
   
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "blaze.ws",
    database: "chad"
  });

// middleware
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());


app.get('/', (req,res) => {
  res.redirect('/login');
});

// login page
app.get('/login', function(req,res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		con.query('SELECT * FROM ilance_users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
        response.send({message : "true"});
			} else {
				response.send({message : "incorrect Username or password"});
			}			
		});
  } 
});

// product data 
app.get('/productData', function(req,res){
  var Search = req.query.search;
  if(Search  == "recent" ) {
    var sql = " SELECT * FROM ilance_projects as t1 LEFT JOIN ilance_categories as t2 ON t1.cid = t2.cid LEFT JOIN ilance_users as t3 ON t1.user_id = t3.user_id ";
  }

  if(Search  == "tproduct" ) {
    var sql = " SELECT * FROM ilance_projects as t1 LEFT JOIN ilance_categories as t2 ON t1.cid = t2.cid LEFT JOIN ilance_users as t3 ON t1.user_id = t3.user_id ORDER BY t1.project_title ASC ";

  }
  if(Search  == "uname" ) {
    var sql = " SELECT * FROM ilance_projects as t1 LEFT JOIN ilance_categories as t2 ON t1.cid = t2.cid LEFT JOIN ilance_users as t3 ON t1.user_id = t3.user_id ORDER BY t3.username ASC ";

  }
  if(Search  == "cname" ) {
    var sql = " SELECT * FROM ilance_projects as t1 LEFT JOIN ilance_categories as t2 ON t1.cid = t2.cid LEFT JOIN ilance_users as t3 ON t1.user_id = t3.user_id ORDER BY t2.category_name ASC ";

  }

    con.query(sql, function(error, results, fields) {
    if (results.length > 0) {
         res.send({products:results});
    }
  });

});

// product page
app.get('/product', function(request, response) {
	if (request.session.loggedin) {
    response.sendFile(__dirname + '/product.html');
  } 
  else {
		response.send('Please login to view this page!');
  }
  
});

// url 404 page 
app.get('*', function(req, res) {
  res.status(404).send('page Not found');
});


app.listen(port, ()=> {
console.log('server running port :' + port);
});
  
