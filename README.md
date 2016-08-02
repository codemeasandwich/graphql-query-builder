# graphql-query-builder

[![npm version](https://badge.fury.io/js/graphql-query-builder.svg)](https://badge.fury.io/js/graphql-query-builder)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
[![build](https://api.travis-ci.org/codemeasandwich/graphql-query-builder.svg)](https://travis-ci.org/codemeasandwich/graphql-query-builder)
[![Coverage Status](https://coveralls.io/repos/github/codemeasandwich/graphql-query-builder/badge.svg?branch=master)](https://coveralls.io/github/codemeasandwich/graphql-query-builder?branch=master)
[![bitHound Overall Score](https://www.bithound.io/github/codemeasandwich/graphql-query-builder/badges/score.svg)](https://www.bithound.io/github/codemeasandwich/graphql-query-builder)

a simple but powerful graphQL query builder

### [Demo](https://tonicdev.com/codemeasandwich/57a0727c80254315001cb366)

# Install

`npm install graphql-query-builder`

## run samples

``` bash
node example/simple.js
```

# Example

``` js 
var Query = require('graphql-query-builder');

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
    
```

