//creating app for Curam-Me medication app, NCI Computing Year 2 ITP Project

var express = require("express"); //call the express module 
var session = require("express-session");//call the express sessions module
var app = express(); //declaration of app, initialising it as an object express 
var bodyParser = require('body-parser');//allow access to body parser
var mysql = require('mysql');//alows access to mysql and connect to our database
var bcrypt = require('bcrypt');//allows us to encrypt any data transmissions to/from the database




//create the connection variable for the database with all arguments for connection
// *** The database is a secure server database and only white listed IP's can connect ***
var connection = mysql.createConnection({
	host:'mysql4220.cp.blacknight.com',
	user:'u1518531_user00',
	password:'cU*@mM3^_q',
	database:'db1518531_curamme'
});


//establish the connection to the database and display either a success message 
//or error message in the command prompt of the system on connection attempt
connection.connect(function(error){
	if(!!error){
		console.log('Error connecting to server');
	}else{
		console.log('Database connection success!');

	}
});

//set the app to use a session cookie
app.use(session({
	secret:'3GvlL0!pX0',
	resave:true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended:true}));
//set the app to use the specific folders in the main directory
app.use(express.static("views")); //use the views folder ejs files
app.use(express.static("scripts")); //use the scripts folder for functionality
app.use(express.static("images")); //use the images folder for images


//setting the view engine
app.set('view engine','ejs');


//create and provide the server port for the app
app.listen(80, function(){
	console.log("Server is running correctly");
});

//route to login page
app.get('/', function(req,res){
	//check if the user is already logged in and redirect to the correct page
	if(req.session.loggedin){
		res.redirect("home");
	}else{
		res.render("index");
	}
	res.end();
});

//sign in route, test and redirect if the users credentials are correct, else redirect back to the incorrect login page
app.post('/login', async(req,res) =>
{
	var username = req.body.username; //get the username from the login page submission
	var password = req.body.password; //get the password from the login page submission

	if(username && password){
		//if there is a password and username, then create a query and send to the database
		connection.query("SELECT * FROM Security WHERE Username = ? AND Password = ?;", [username, password], function(error, results, fields){
			//if there is a match then set the var user to the result at index 0, there should only be one result if details are correct
			if(results.length > 0){
				let user = results[0];
				//set the login session to true for persistance of the login cookie
				req.session.loggedin = true;
				//set the username for the session to the staff id of the person who logged in, useful for adding records to the database now under that 
				//staff persons ID
				req.session.username = results[0].S_ID;

				//test outputs that will be adjusted later on
				console.log(results[0].S_ID);
				res.render("home");
				res.end();
			}else{
				//if the details are wrong redirect back to the login page 
				res.redirect('/');
			}
			res.end();
		})
	}
});



//logout feature to destroy session and redirect to login page
app.get('/logout', function(req,res, next){
	req.session.destroy();
	res.redirect('/');
})













