
crypto = require("crypto");


var NewsPost = {
	name: 'NewsPost',
	

	setDB: function(db) {
		this.db = db;
	},
	insert: function(data, callback) {
		data.ID = crypto.randomBytes(20).toString('hex');
		console.log("In Insert Function")
		console.log(this.collection)
		this.collection().insert(data, {}, callback || function(){ });
	},
	update: function(data, callback) {
		this.collection().update({ID: data.ID}, data, {}, callback || function(){ });	
	},
	getlist: function(callback, query, sortQuery) {
		this.collection().find(query || {}).toArray(callback);
	},
	find: function(callback, ID) {
		console.log(ID)
		this.collection().find(ID).toArray(callback);

	},
	comments: function(callback, ID) {
		console.log(ID)
		this.db.collection('comments').find(ID).toArray(callback);
		
	},
	remove: function(ID, callback) {
		this.collection().findAndModify({ID: ID}, [], {}, {remove: true}, callback);
	},
	collection: function() {
		if(this._collection) return this._collection;
		return this._collection = this.db.collection('news');
	},
	create: function(data, callback){
		var self = this;
		this.nextSequence(data,function(data){
			//console.log(self)
			self.insert(data,callback)
			
		})
	},
	addComment:function(data, callback) {
		
		console.log("Adding Comment")
		var self = this;
		this.db.collection('comments').insert(data, {}, function(err,rec){ 
			self.collection('news').update({news_id:41}, {$inc: {comments:1}},function(err, rec){
			
			callback();
			});	
			

		});

		
		
		
	},

	nextSequence:function(data ,callback){
			console.log("cominghere")
			var self = this;
  	 this.db.collection('counters').findAndModify(
          
            { _id: this.name },
            [['_id','asc']],
            { $inc: { seq: 1 } },
            {new:true},
            function(err, rec){  
            	//console.log(err + ' hello1 ' + rec);
            		self.db.collection('counters').find({_id : 'NewsPost'},
            			 function(err,rec){ 
            			 	rec.toArray(function(err, rec){console.log(rec); data.news_id = rec[0]["seq"]; callback(data);}
    )
            			 }

   );

}) 

}
};



module.exports = NewsPost;