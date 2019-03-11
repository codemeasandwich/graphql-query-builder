/* eslint-disable require-jsdoc, max-lines-per-function */
'use strict';
const expect = require('chai').expect;
const {
	Query,
	Nested
} = require('./index');

function removeSpaces(textS) {
	return `${textS}`.replace(/\s+/g, '');
}

describe('graphql query builder', function() { // log the function
	it('should accept a single find value', function() {
		const expeted = `query{user{age}}`;
		const user = new Query('user').select('age');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should create a Query with function name & alias', function() {

		const expeted = `query{sam : user{name}}`;
		const user = new Query('user', 'sam').select('name');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should create a Query with function name & input', function() {

		const expeted = `query{user(id:12345){name}}`;
		const user = new Query('user', {
			id: 12345
		}).select('name');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should create a Query with function name & input(s)', function() {

		const expeted = `query{user(id:12345, age:34){name}}`;
		const user = new Query('user', {
			id: 12345,
			age: 34
		}).select('name');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should accept a single find value with alia', function() {
		const expeted = `query{user{nickname:name}}`;
		const user = new Query('user').select({
			nickname: 'name'
		});

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should accept a multiple find values', function() {
		const expeted = `query{user{firstname, lastname}}`;
		const user = new Query('user').select('firstname', 'lastname');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should accept an array find values', function() {
		const expeted = `query{user{firstname, lastname}}`;
		const user = new Query('user').select(['firstname', 'lastname']);

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should work with nesting Querys', function() {

		const expeted = `query{user( id:12345 ) {
            id,  nickname : name,  isViewerFriend,
            image : profilePicture( size:50 ) {
              uri,  width,    height  }    }}`;

		const profilePicture = new Nested('profilePicture', {
			size: 50
		});
		profilePicture.select('uri', 'width', 'height');

		const user = new Query('user', {
			id: 12345
		});
		user.select(['id', {
			'nickname': 'name'
		}, 'isViewerFriend', {
			'image': profilePicture
		}]);

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should work with simple nesting Querys', function() {

		const expeted = `query{user { profilePicture { uri, width, height } }}`;

		const user = new Query('user');
		user.select({
			'profilePicture': ['uri', 'width', 'height']
		});

		expect(removeSpaces(expeted)).to.equal(removeSpaces(user));
	});

	it('should be able to group Querys', function() {

		const expeted = `query{FetchLeeAndSam { lee: user(id: "1") { name  },
                                    sam: user(id: "2") { name  }  }}`;

		const FetchLeeAndSam = new Query('FetchLeeAndSam');

		const lee = new Nested('user', {
			id: '1'
		});
		lee.setAlias('lee');
		lee.select(['name']);

		const sam = new Nested('user', 'sam');
		sam.filter({
			id: '2'
		});
		sam.select('name');

		FetchLeeAndSam.select(lee, sam);

		expect(removeSpaces(expeted)).to.equal(removeSpaces(FetchLeeAndSam));
	});

	it('should work with nasted objects and lists', function() {

		const expeted = `query{myPost:Message(type:"chat",message:"yoyo",
                                user:{name:"bob",screen:{height:1080,width:1920}},
                                friends:[{id:1,name:"ann"},{id:2,name:"tom"}])  {
                        messageId : id, postedTime : createTime }}`;

		const MessageRequest = {
			type: 'chat',
			message: 'yoyo',
			user: {
				name: 'bob',
				screen: {
					height: 1080,
					width: 1920
				}
			},
			friends: [{
				id: 1,
				name: 'ann'
			}, {
				id: 2,
				name: 'tom'
			}]
		};

		const MessageQuery = new Query('Message', 'myPost');
		MessageQuery.filter(MessageRequest);
		MessageQuery.select({
			messageId: 'id'
		}, {
			postedTime: 'createTime'
		});

		expect(removeSpaces(expeted)).to.equal(removeSpaces(MessageQuery));

	});

	it('should work with objects that have help functions(will skip function name)', function() {

		const expeted = 'query{inventory(toy:"jack in the box")  { id }}';

		const ChildsToy = {
			toy: 'jack in the box',
			getState: function() {}
		};

		ChildsToy.getState(); // for istanbul(coverage) to say all fn was called

		const ItemQuery = new Query('inventory', ChildsToy);
		ItemQuery.select('id');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(ItemQuery));

	});

	it('should work with nasted objects that have help functions(will skip function name)', function() {

		const expeted = 'query{inventory(toy:"jack in the box")  { id }}';

		const ChildsToy = {
			toy: 'jack in the box',
			utils: {
				getState: function() {}
			}
		};

		ChildsToy.utils.getState(); // for istanbul(coverage) to say all fn was called

		const ItemQuery = new Query('inventory', ChildsToy);
		ItemQuery.select('id');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(ItemQuery));

	});

	it('should skip empty objects in filter/args', function() {

		const expeted = 'query{inventory(toy:"jack in the box")  { id }}';

		const ChildsToy = {
			toy: 'jack in the box',
			utils: {}
		};

		const ItemQuery = new Query('inventory', ChildsToy);
		ItemQuery.select('id');

		expect(removeSpaces(expeted)).to.equal(removeSpaces(ItemQuery));
	});

	it('should throw Error if find input items have zero props', function() {
		expect(() => new Query('x').select({})).to.throw(Error);
	});

	it('should throw Error if find input items have multiple props', function() {
		expect(() => new Query('x').select({
			a: 'z',
			b: 'y'
		})).to.throw(Error);
	});

	it('should throw Error if find is undefined', function() {
		expect(() => new Query('x').select()).to.throw(Error);
	});

	it('should throw Error if no find values have been set', function() {
		expect(() => `${new Query('x')}`).to.throw(Error);
	});

	it('should throw Error if find is not valid', function() {
		expect(() => new Query('x').select(123)).to.throw(Error);
	});

	it('should throw Error if you accidentally pass an undefined', function() {
		expect(() => new Query('x', undefined)).to.throw(Error);
	});

	it('should throw Error it is not an input object for alias', function() {
		expect(() => new Query('x', true)).to.throw(Error);
	});
});
