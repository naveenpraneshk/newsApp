var BaseController = require("./Base"),
	View = require("../views/Base"),
	
	crypto = require("crypto"),
	fs = require("fs");
 
 var NewsPost = require('../models/NewsPost');
 

module.exports  = BaseController.extend({
name:'NewsPost',
content:null,
run: function(req, res, next){
NewsPost.setDB(req.db)
var self = this;
this.getNews(function(){
	var v = new View(res, 'news');
	v.render(self.content) }
	)

},
newsForm: function(req,res, next){
	
	NewsPost.setDB(req.db)
	var self = this;
this.getNews(function(){
	var v = new View(res, 'newsAdd');
	
	v.render({'message': '<i> Add News Post </i>'}) 
 })


},
view:function(req, res, next){
	NewsPost.setDB(req.db);
	var self = this;
	if(req.params.id){
		news_id = req.params.id;
		this.getNews1(function(){
			var v = new View(res, 'newsShow');
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
				title: req.body.title,
				content: req.body.content,
				ID: req.body.ID
			}

			NewsPost.create(data, function(err, objects) {
				if(err)
					console.log(err)
				console.log("post successfully created")
				res.redirect ('/news')
			});



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

		console.log(req.body.comment)

		NewsPost.addComment(comment, function(err, records){
			if(!err)
			res.send({result:true})
		else 
			res.send({result:false})
		})

	}
},


getNews: function(callback){

		var self = this;
		this.content = {};
		NewsPost.getlist(function(err, records){
			console.log('getNews')
			//console.log(records)
		var newsArticles = '';
				if(records.length > 0) {
					for(var i=0; record=records[i]; i++) {
						var record = records[i];
						newsArticles += ' <section class="item">\
															<h2>' + record.title + '</h2>\
	                            <p>' + record.content + '</p>\
	                            <br class="clear" />\
								<hr />\
	                        </section>\
						';

					}
				}
				//console.log(newsArticles)
				self.content.newsArticles = newsArticles;

				callback();
		}, '');},

		getNews1:function(callback, id){

			var self = this;
			this.content={};
			console.log(id)
			var newspost= NewsPost
			NewsPost.find(function(err, records){
				var newsArticle = records[0] ;
				console.log(records + ' error ' + err)
				console.log(newsArticle)
				self.content.newsArticle = newsArticle['content'];
				newspost.comments(function(err,records){
					console.log(records);
					comments = ''
					for(var i=0; record=records[i]; i++) {
						var record = records[i];
						comments += ' <section class="item">\
															<h2>' + record.user_id + '</h2>\
	                            <p>' + record.comment + '</p>\
	                            <br class="clear" />\
								<hr />\
	                        </section>\
						';

					}
				
					self.content.comments = comments
					callback();	
				});
				
			}, id)


		}


	








});