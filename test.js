"use strict";
var expect = require('chai').expect;
var Query = require('./index');

function removeSpaces(textS) {
    return `${textS}`.replace(/\s+/g, '');
}

describe("graphql query builder", function() { //log the function
	
	it('should allow function chaining', function(){
		
		let expetedName = `profile{name}`;
		let profileName = new Query("profile").find("name");
		
		expect(removeSpaces(expetedName)).to.equal(removeSpaces(profileName));
	});
	
	it('should accept a single find value', function(){
		let expetedAge = `user{age}`;
		let userAge = new Query("user").find("age");
		
		expect(removeSpaces(expetedAge)).to.equal(removeSpaces(userAge));
	});
	
	it('should create a Query with function name & alia', function(){
		
		let expeted = `sam : user{name}`;
		let user = new Query("user","sam").find("name");
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
	
	it('should create a Query with function name & input', function(){
		
		let expeted = `user(id:12345){name}`;
		let user = new Query("user",{id : 12345}).find("name");
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
	
	it('should create a Query with function name & input(s)', function(){
		
		let expeted = `user(id:12345, age:34){name}`;
		let user = new Query("user",{id : 12345, age:34}).find("name");
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
	
	it('should accept a single find value with alia', function(){
		let expeted = `user{nickname:name}`;
		let user = new Query("user").find({nickname:"name"});
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
		
	it('should accept a multiple find values', function(){
		let expeted = `user{firstname, lastname}`;
		let user = new Query("user").find("firstname","lastname")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
	
	it('should accept an array find values', function(){
		let expeted = `user{firstname, lastname}`;
		let user = new Query("user").find(["firstname","lastname"]);
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
	
	it('should work with nesting Querys', function(){
		
		let expeted = `user( id:12345 ) {
						id,	nickname : name,	isViewerFriend,
						image : profilePicture( size:50 ) {
							uri,	width,		height	}	  }`;
		
		let profilePicture = new Query("profilePicture",{size : 50});
			profilePicture.find( "uri", "width", "height");
			
		let user = new Query("user",{id : 12345});
			user.find(["id", {"nickname":"name"}, "isViewerFriend",  {"image":profilePicture}]);

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});
	
	it('should be able to group Querys', function(){
		
		let expeted = `FetchLeeAndSam { lee: user(id: "1") { name	},
						                        sam: user(id: "2") { name	}  }`;
				
		let FetchLeeAndSam = new Query("FetchLeeAndSam");
		
		let lee = new Query("user",{id : '1'});
		  lee.setAlias('lee');
		  lee.find(["name"]);
		  
		let sam = new Query("user","sam");
		  sam.filter({id : '2'});
		  sam.find("name");
		  
		FetchLeeAndSam.find(lee,sam);
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(FetchLeeAndSam));
	});
	
	it('should work with nasted objects and lists', function(){
    
    let expeted =`myPost:Message(type:"chat",message:"yoyo",
                                user:{name:"bob",screen:{height:1080,width:1920}},
                                friends:[{id:1,name:"ann"},{id:2,name:"tom"}])  {
                        messageId : id, postedTime : createTime }`;
    
    let MessageRequest = {  type:"chat",
                            message:"yoyo",
                            user:{ name:"bob",
                                   screen:{ height:1080, width:1920 }  },
                             friends:[ {id:1,name:"ann"}, {id:2,name:"tom"} ]
                             };
    
    let MessageQuery = new Query("Message","myPost");
        MessageQuery.filter(MessageRequest);
        MessageQuery.find({ messageId : "id"}, {postedTime : "createTime" });
    
		expect(removeSpaces(expeted)).to.equal(removeSpaces(MessageQuery));
    
	});
	
	it('should work with objects that have help functions(will skip function name)', function(){
    
    let expeted ='inventory(toy:"jack in the box")  { id }';
    
    let ChildsToy = {  toy:"jack in the box",  getState:function(){  }  };
                     
    ChildsToy.getState();//for istanbul(coverage) to say all fn was called
    
    let ItemQuery = new Query("inventory",ChildsToy);
        ItemQuery.find("id");
    
		expect(removeSpaces(expeted)).to.equal(removeSpaces(ItemQuery));
    
	});
	
	it('should work with nasted objects that have help functions(will skip function name)', function(){
    
    let expeted ='inventory(toy:"jack in the box")  { id }';
    
    let ChildsToy = {  toy:"jack in the box",  utils: {  getState:function(){  }  }  };
    
    ChildsToy.utils.getState();//for istanbul(coverage) to say all fn was called
    
    let ItemQuery = new Query("inventory",ChildsToy);
        ItemQuery.find("id");
    
		expect(removeSpaces(expeted)).to.equal(removeSpaces(ItemQuery));
    
	});
	
	it('should skip empty objects in filter/args', function(){
    
    let expeted ='inventory(toy:"jack in the box")  { id }';
    
    let ChildsToy = {  toy:"jack in the box", utils: {  }  };
    
    let ItemQuery = new Query("inventory",ChildsToy);
        ItemQuery.find("id");
    
		expect(removeSpaces(expeted)).to.equal(removeSpaces(ItemQuery));
	});
	
	it('should throw Error if find input items have zero props', function(){
		expect(() => new Query("x").find({})).to.throw(Error);
	});
	
	it('should throw Error if find input items have multiple props', function(){
		expect(() => new Query("x").find({a:"z",b:"y"})).to.throw(Error);
	});
	
	it('should throw Error if find is undefined', function(){
		expect(() => new Query("x").find()).to.throw(Error);
	});
	
	it('should throw Error if no find values have been set', function(){
		expect(() => `${new Query("x")}`).to.throw(Error);
	});
	
	it('should throw Error if find is not valid', function(){
		expect(() => new Query("x").find(123)).to.throw(Error);
	});
	
	it('should throw Error if you accidentally pass an undefined', function(){
		expect(() => new Query("x",undefined)).to.throw(Error);
	});
	
	it('should throw Error it is not an input object for alias', function(){
		expect(() => new Query("x",true)).to.throw(Error);
	});
});