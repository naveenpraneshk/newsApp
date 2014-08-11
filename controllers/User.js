var BaseController = require("./Base"),
	View = require("../views/Base"),
	
	crypto = require("crypto"),
	fs = require("fs");
 
 
 var User = require('../models/User');

module.exports  = BaseController.extend({
name:'Users',	
content:null,
loggedIn:false,
run: function(req, res, next){
User.setDB(req.db)
var self = this;
console.log( req.session)
this.getProfile(function(){
	var v = new View(res, 'profile');
	if(req.session.newsApp)
	self.content.newsApp = req.session.newsApp;
	v.render(self.content); },
	{id:req.params.id}
	)

},

authorize: function(req) {

		return (
			req.session && 
			req.session.newsApp 
		) ;
	},
loginPage: function(req, res, next){
	
	var v = new View(res,'login');
	v.render(this.content);
	
},
logout:function(req, res, next){
	console.log(req.session);
	req.session.destroy(function(){
		
		
		res.redirect('/');
	})
},

login:function(req, res, next){
	User.setDB(req.db)
	var self = this;
	var username = req.body.username;
    var password = req.body.password;
 		User.find(function(err, records){
 			record = records[0];
 			if(username == record.username && password == record.password) 
 			{req.session.newsApp = {};
 				req.session.newsApp.loggedIn = true;
 				req.session.newsApp.username = username;

 				console.log('session' + req.session);
 				res.redirect('/users/'+record.user_id);

 			}
 			else
 				res.redirect('/login');
 		},
 		{username:username})

    
},
getProfile:function(callback,id){
	
	var self = this;
	console.log(id)
	User.find(function(err, records){
		self.content={};
		console.log(records)
		console.log("error" + err)
		record = records[0];
		console.log(record)
		profile = {user_id: record.user_id, username:record.username, posts:record.posts, email:record.email, created_at: record.created_at};
		self.content.profile = profile;



		
		callback();

	},id )
},
create: function(req, res,next){
	User.setDB(req.db)
	var data = {
		username: req.body.username,
		password: req.body.password,
		about: req.body.about,
		email:req.body.email,
		karma: 1,
		created_at: new Date()


	}
	console.log(User)
	User.create(data, function(err, objects) {
				if(err)
					console.log(err)
				console.log("User created")
				res.redirect ('/news')
			});

}


});