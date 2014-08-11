var BaseController = require("./Base"),
	View = require("../views/Base"),
	
	crypto = require("crypto"),
	fs = require("fs");
 
 var Comment = require('../models/Comment');
 

module.exports  = BaseController.extend({
name:'comment',
content:null,
run: function(req, res, next, newsType){
console.log(newsType)
Comment.setDB(req.db)
var self = this;
this.getComments(function(){
	var v = new View(res, 'comments');
	if(req.session.newsApp)
		self.content.newsApp = req.session.newsApp;
	v.render(self.content) }
	);

},
getComments:function(callback){
	var self = this;
	this.content = {};
	Comment.getlist(function(err, records){
		var comments = [];
		if(records.length > 0) {
					for(var i=0; record=records[i]; i++) {
						var record = records[i];
						comments[i] = { comment: record.comment }
						 
					}
				}
		self.content.comments = comments
		callback();
	}, {});
}

});


/*var self = this;
		this.content = {};
		NewsPost.getlist(function(err, records){
			console.log('getNews')
			//console.log(records)
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
		}, '');
*/