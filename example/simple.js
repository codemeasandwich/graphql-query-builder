var Query = require('../');


/*
{
 user( id:3500401 ) {
    id,
    nickname : name,
    isViewerFriend,
    
    profilePicture( size:50 ) {
        uri,
        width,
        height
    }
  }
}
*/

let profilePicture = new Query("profilePicture",{size : 50});
    profilePicture.find( "uri", "width", "height");
let user = new Query("user",{id : 3500401});
    user.find(["id", {"nickname":"name"}, "isViewerFriend",  {"image":profilePicture}])

  logger.log("user",user+"");
/*

query FetchLeeAndSam {
  lee: user(id: "1") {
    name
  }
  sam: user(id: "2") {
    name
  }
}
*/

let FetchLeeAndSam = new Query("FetchLeeAndSam");

let lee = new Query("user",{id : '1'});
  lee.setAlias('lee');
  lee.find({name:true});
  logger.log("lee",lee.toString());
  
let sam = new Query("user","sam");
  sam.filter({id : '2'});
  sam.find("name");
  logger.log("sam",sam+"");
  
 console.log(FetchLeeAndSam.find(lee,sam)+"")
