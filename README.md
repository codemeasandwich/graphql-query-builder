# mab-graphql-query-assembler

a simple but powerful graphQL query builder

# Install

`npm install mab-graphql-query-assembler`

# Api

``` js
const Query = require('mab-graphql-query-assembler');
```

### constructor
query/mutator you wish to use, and an alias or filter arguments.

| Argument (**one** to **two**)  | Description
|--- |---
| String | the name of the query function
| * String / Object | (**optional**) This can be an `alias` or `filter` values

``` js
let profilePicture = new Query("profilePicture",{size : 50});
```

### setAlias
set an alias for this result.

| Argument | Description
|--- |---
| String | The alias for this result

``` js
profilePicture.setAlias("MyPic");
```

### filter
the parameters to run the query against.

| Argument | Description
|--- |---
| Object | An object mapping attribute to values

``` js
profilePicture.filter({ height : 200, width : 200});
```

### find
outlines the properties you wish to be returned from the query.

| Argument (**one** to **many**) | Description
|--- |---
| String or Object |  representing each attribute you want Returned
| ... | *same as above*

``` js
    profilePicture.find( { link : "uri"}, "width", "height");
```

### toString
return to the formatted query string

``` js
  // A (ES6)
  `${profilePicture}`;
  // B
  profilePicture+'';
  // C
  profilePicture.toString();
```

## run samples

``` bash
node example/simple.js
```

# Example

``` js
var Query = require('mab-graphql-query-assembler');

// example of nesting Querys
let profilePicture = new Query("profilePicture",{size : 50});
    profilePicture.find( "uri", "width", "height");

let user = new Query("user",{id : 123});
    user.find(["id", {"nickname":"name"}, "isViewerFriend",  {"image":profilePicture}])

    console.log(user)
    /*
     user( id:123 ) {
    id,
    nickname : name,
    isViewerFriend,

    image : profilePicture( size:50 ) {
        uri,
        width,
        height
    }
  }
    */

// And another example

let MessageRequest = { type:"chat", message:"yoyo",
                   user:{
                            name:"bob",
                            screen:{
                                    height:1080,
                                    width:1920
                                    }
                    },
                    friends:[
                             {id:1,name:"ann"},
                             {id:2,name:"tom"}
                             ]
                    };

let MessageQuery = new Query("Message","myPost");
    MessageQuery.filter(MessageRequest);
    MessageQuery.find({ messageId : "id"}, {postedTime : "createTime" });

    console.log(MessageQuery);

    /*
    myPost:Message( type:"chat",
                    message:"yoyo",
                    user:{name:"bob",screen:{height:1080,width:1920}},
                    friends:[{id:1,name:"ann"},{id:2,name:"tom"}])
        {
            messageId : id,
            postedTime : createTime
        }
    */

    // Simple nesting

    let user = new Query("user");
        user.find([{"profilePicture":["uri", "width", "height"]}])

    /*
    user {
      profilePicture {
        uri,
        width,
        height
       }
     }
    */

    // Simple nesting with rename

    let user = new Query("user");
        user.find([{"image":{"profilePicture":["uri", "width", "height"]}}])

    /*
    user {
      image : profilePicture {
        uri,
        width,
        height
       }
     }
    */
```
