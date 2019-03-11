# graphql-query-builder

a simple but powerful graphQL query builder

**info:**

[![npm version](https://badge.fury.io/js/graphql-query-builder.svg)](https://badge.fury.io/js/graphql-query-builder)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![pull requests welcome](https://img.shields.io/badge/Pull%20requests-welcome-pink.svg)](https://github.com/codemeasandwich/graphql-query-builder/pulls)
[![GitHub stars](https://img.shields.io/github/stars/codemeasandwich/graphql-query-builder.svg?style=social&label=Star)](https://github.com/codemeasandwich/graphql-query-builder)


**tests:**

[![build](https://api.travis-ci.org/codemeasandwich/graphql-query-builder.svg)](https://travis-ci.org/codemeasandwich/graphql-query-builder)
[![Coverage Status](https://coveralls.io/repos/github/codemeasandwich/graphql-query-builder/badge.svg?branch=master)](https://coveralls.io/github/codemeasandwich/graphql-query-builder?branch=master)


**quality:**

[![Code Climate](https://codeclimate.com/github/codemeasandwich/graphql-query-builder/badges/gpa.svg)](https://codeclimate.com/github/codemeasandwich/graphql-query-builder)
[![bitHound Overall Score](https://www.bithound.io/github/codemeasandwich/graphql-query-builder/badges/score.svg)](https://www.bithound.io/github/codemeasandwich/graphql-query-builder)
[![Issue Count](https://codeclimate.com/github/codemeasandwich/graphql-query-builder/badges/issue_count.svg)](https://codeclimate.com/github/codemeasandwich/graphql-query-builder)
[![Known Vulnerabilities](https://snyk.io/test/npm/graphql-query-builder/badge.svg)](https://snyk.io/test/npm/graphql-query-builder)

### If this was helpful, [★ it on github](https://github.com/codemeasandwich/graphql-query-builder)

*tested on [**NodeJS**](https://nodejs.org) and [**Webpack**](https://webpack.github.io)*
## API

``` js
  const {Query, Mutation, Nested} = require('graphql-query-builder');
```

### constructor
Query or Mutator you wish to use, and an alias or filter arguments.

| Argument | Description
|--- |---
| String | the name of the query function
| String or Object | (**optional**) This can be an `alias` or `filter` values

``` js
  const profilePicture = new Query('profilePicture', {size: 50});
```

### setAlias
set an alias for this result.

| Argument | Description
|--- |---
| String | The alias for this result

``` js
  profilePicture.setAlias('MyPic');
```

### filter
the parameters to run the query against.

| Argument | Description
|--- |---
| Object | An object mapping attribute to values

``` js
  profilePicture.filter({ height: 200, width: 200});
```

### select
outlines the properties you wish to be returned from the query.

| Argument | Description
|--- |---
| String or Object or Array |  representing each attribute you want Returned

```javascript
  profilePicture.select({link: 'uri'}, 'width', 'height');
```

### toString
return to the formatted query string

```javascript
  profilePicture.toString();
```

## Examples

### Nested Query Example

```javascript
  const profilePicture = new Nested('profilePicture', {size: 50});
  profilePicture.select('uri', 'width', 'height');

  const user = new Query('user', {id: 123});
  user.select(['id', {nickname: 'name'}, 'isViewerFriend',  {image: profilePicture}]);

  /*
    query {
      user( id:123 ) {
        id,
        nickname: name,
        isViewerFriend,
        image: profilePicture( size: 50 ) {
          uri,
          width,
          height
        }
      }
    }
  */
```

### Mutation Example

```javascript
  const MessageRequest = {
    type: 'chat',
    message: 'yoyo',
    user:{
      name: 'bob',
      screen:{
        height: 1080,
        width: 1920
      }
    },
    friends: [
      {id: 1, name: 'ann'},
      {id: 2, name: 'tom'}
    ]
  };

  const MessageQuery = new Mutation('Message', 'myPost');
  MessageQuery.filter(MessageRequest);
  MessageQuery.select({messageId: 'id'}, {postedTime: 'createTime' });

  /*
    mutation {
      myPost:Message(
        type: 'chat',
        message: 'yoyo',
        user: {
          name:'bob',
          screen: {
            height:1080,
            width:1920
          }
        },
        friends: [{id: 1, name: 'ann'},{id: 2, name: 'tom'}]
      )
      {
        messageId: id,
        postedTime: createTime
      }
    }
  */
```

### Nested select Query

```javascript
  const user = new Query('user');
  user.select([{profilePicture: ['uri', 'width', 'height']}]);

  /*
    query {
      user {
        profilePicture {
          uri,
          width,
          height
        }
      }
    }
  */
```

### Nested select query with rename

```javascript
  const user = new Query('user');
  user.select([{image: {profilePicture: ['uri', 'width', 'height']}}]);

  /*
    query {
      user {
        image: profilePicture {
          uri,
          width,
          height
        }
      }
    }
  */
```
