"use strict"
var expect = require('chai').expect;
var Query = require('./index');

function removeSpaces(textS) {
    return `${textS}`.replace(/\s+/g, '');
}

describe("graphql query builder", function() { //log the function
	
	it('should allow function chaining', function(){
		
		let expeted = `user{name}`;
		let user = new Query("user").find("name")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should create a Query with function name & alia', function(){
		
		let expeted = `sam : user{name}`;
		let user = new Query("user","sam").find("name")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should create a Query with function name & input', function(){
		
		let expeted = `user(id:12345){name}`;
		let user = new Query("user",{id : 12345}).find("name")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should create a Query with function name & input(s)', function(){
		
		let expeted = `user(id:12345, age:34){name}`;
		let user = new Query("user",{id : 12345, age:34}).find("name")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should accept a single find value', function(){
		let expeted = `user{name}`;
		let user = new Query("user").find("name")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should accept a single find value with alia', function(){
		let expeted = `user{nickname:name}`;
		let user = new Query("user").find({nickname:"name"})
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
		
	it('should accept a multiple find values', function(){
		let expeted = `user{firstname, lastname}`;
		let user = new Query("user").find("firstname","lastname")
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should accept an array find values', function(){
		let expeted = `user{firstname, lastname}`;
		let user = new Query("user").find(["firstname","lastname"])
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should work with nesting Querys', function(){
		
		let expeted = `user( id:12345 ) {
						id,
						nickname : name,
						isViewerFriend,
						image : profilePicture( size:50 ) {
							uri,	width,		height
						}
					  }`;
		
		let profilePicture = new Query("profilePicture",{size : 50});
			profilePicture.find( "uri", "width", "height");
			
		let user = new Query("user",{id : 12345});
			user.find(["id", {"nickname":"name"}, "isViewerFriend",  {"image":profilePicture}])

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	})
	
	it('should be able to group Querys', function(){
		
		let expeted = `FetchLeeAndSam {
						lee: user(id: "1") {
						  name
						},
						sam: user(id: "2") {
						  name
						}
					  }`;
				
		let FetchLeeAndSam = new Query("FetchLeeAndSam");
		
		let lee = new Query("user",{id : '1'});
		  lee.setAlias('lee');
		  lee.find(["name"]);
		  
		let sam = new Query("user","sam");
		  sam.filter({id : '2'});
		  sam.find("name");
		  
		FetchLeeAndSam.find(lee,sam);
		
		expect(removeSpaces(expeted)).to.equal(removeSpaces(FetchLeeAndSam));
	})
	
	it('should throw Error if find input items have zero props', function(){
		expect(() => new Query("x").find({})).to.throw(Error);
	})
	
	it('should throw Error if find input items have multiple props', function(){
		expect(() => new Query("x").find({a:"z",b:"y"})).to.throw(Error);
	})
	
	it('should throw Error if find is undefined', function(){
		expect(() => new Query("x").find()).to.throw(Error);
	})
	
	it('should throw Error if no find values have been set', function(){
		expect(() => `${new Query("x")}`).to.throw(Error);
	})
	
	it('should throw Error if find is not valid', function(){
		expect(() => new Query("x").find(123)).to.throw(Error);
	})
	
	it('should throw Error if you accidentally pass an undefined', function(){
		let alia = undefined;
		expect(() => new Query("x",alia)).to.throw(Error);
	})
	
	it('should throw Error it is not an input object for alias', function(){
		expect(() => new Query("x",true)).to.throw(Error);
	})
});

