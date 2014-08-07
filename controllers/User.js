var BaseController = require("./Base"),
	View = require("../views/Base"),
	
	crypto = require("crypto"),
	fs = require("fs");
 
 
 var User = require('../models/User');

module.exports  = BaseController.extend({
name:'Users',
content:null,
run: function(req, res, next){
User.setDB(req.db)
var self = this;
this.getProfile(function(){
	var v = new View(res, 'profile');
	v.render(self.content) }
	)

},

authorize: function(req) {
		return (
			req.session && 
			req.session.fastdelivery && 
			req.session.fastdelivery === true
		) || (
			req.body && 
			req.body.username === this.username && 
			req.body.password === this.password
		);
	},
loginPage: function(req, res, next){
	var v = new View(res,'login')
	v.render(this.content)
},
logout:function(req, res, next){
	req.session.destroy(function(){
		res.redirect('/');
	})
},

login:function(req, res, next){
	User.setDB(req.db)
	var username = req.body.username;
    var password = req.body.password;
 
    if(username == 'demo' && password == 'demo'){
    		res.redirect("/news")
        }
    
    else {
       res.redirect('/login');
    } 
},
create: function(req, res,next){
	User.setDB(req.db)
	var username = req.body.username;
	var password = req.body.password;
	var data = {
		username: username,
		password: password
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