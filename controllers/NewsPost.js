var BaseController = require("./Base"),
	View = require("../views/Base"),
	
	crypto = require("crypto"),
	fs = require("fs");
 
 var NewsPost = require('../models/NewsPost');
 var User = require('./User');


module.exports  = BaseController.extend({
name:'NewsPost',
content:null,
run: function(req, res, next, newsType){
(newsType)
NewsPost.setDB(req.db)
var self = this;
this.getNews(function(){
	var v = new View(res, 'index');
	if(req.session.newsApp)
		self.content.newsApp = req.session.newsApp;
	v.render(self.content) }
	, newsType)

},
newsForm: function(req,res, next){
	
	NewsPost.setDB(req.db)
	var self = this;
if(User.authorize(req)){
	var v = new View(res, 'newsAdd');
	if(req.session.newsApp)
		self.content.newsApp = req.session.newsApp;
	v.render(self.content) 
}
	else
	{
		var v = new View(res,'error');
		v.render({message:'You need to be logged in to post. '})

	}



},
view:function(req, res, next){
	NewsPost.setDB(req.db);
	var self = this;
	if(req.params.id){
		news_id = req.params.id;
		this.getNews1(function(){
			var v = new View(res, 'newsShow');
			if(req.session.newsApp)
		 	self.content.newsApp = req.session.newsApp;
			v.render(self.content)
		},{news_id:Number(news_id)})
	}else
	{
		res.send("hello")
	}
	
},
add:function(req, res, next){

	NewsPost.setDB(req.db)
	var self = this;
	
	if(req.body   && req.body.title != '') {
			var data = {
				ID: req.body.ID,
				title: req.body.title,
				url: req.body.url,
				text: req.body.text,
				comments: 0,
				points: 0,
				news_id: 0,
				created_at: new Date(),
				newsType: req.body.newsType
				
			}
			console.log(Date.now)
			if(User.authorize(req))
			NewsPost.create(data, function(err, objects) {
				if(err)
					console.log(err)
				console.log("post successfully created")
				res.redirect ('/news')
			})
		else
			res.send("Authorization Error");



} },
addComment:function(req,res,next){
	NewsPost.setDB(req.db)
	var self = this;

	if(req.body && req.params.id ){
		var comment = {
			user_id: 1,
			news_id: req.params.id,
			comment: req.body.comment
		}

		console.log(req.body.comment + " news_id" + req.body.id )

		NewsPost.addComment(comment, function(err, records){
			if(!err){
				
			res.redirect('/news/'+req.params.id);
		}
		else 
			res.send({result:false})
		})

	}
},


getNews: function(callback, newsType){

		var self = this;
		this.content = {};
		var query = {};
		if (newsType == 'index')
			{
				query = {};
				sortQuery = {points:1}
			}
		else if (newsType == 'show')
			{
				query = {newsType: 'show'};
				sortQuery = {points:1}
			}
		else if (newsType == 'jobs')
			{
				query = {newsType: 'jobs'};
				sortQuery = {points:1}
			}
		else if (newsType == 'ask')
			{
				query = {newsType: 'ask'};
				sortQuery = {points:1}
			}
		else if (newsType = 'new')
			{
				query = {};
				sortQuery = {created_at:-1}
			}

			else
			{
				
				query = {};
				sortQuery = {};
			
			}
		

		
		
		NewsPost.getlist(function(err, records){
			
		var newsArticles = [];
				if(records.length > 0) {
					for(var i=0; record=records[i]; i++) {
						var record = records[i];
						newsArticles[i] = {title: record.title, url:record.url, text:record.text, points:record.points, comments:record.comments, created_at:record.created_at, user_id: record.user_id, news_id:record.news_id}
						 
					}
				}
				//console.log(newsArticles)
				self.content.newsArticles = newsArticles;

				callback();
		}, query,sortQuery);
	},

		getNews1:function(callback, id, sortQuery){

			var self = this;
			this.content={};
			console.log("here:" +id)
			var newspost= NewsPost
			NewsPost.find(function(err, records){
				
				var record = records[0] ;
				if (record)
				self.content.newsArticle = {title: record.title, url:record.url, text:record.text, points:record.points, comments:record.comments, created_at:record.created_at, user_id: record.user_id, news_id:record.news_id};
				newspost.comments(function(err,records){
//					console.log(records);
					comments = [];
					for(var i=0; record=records[i]; i++) {
						var record = records[i];
						comments[i] = {commentContent:record.comment};

					}
				
					self.content.comments = comments
					callback();	
				}, {news_id:""+id.news_id});
				
			}, id)


		}


	








});