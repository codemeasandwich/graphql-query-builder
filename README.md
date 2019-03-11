# graphql-query-builder

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
