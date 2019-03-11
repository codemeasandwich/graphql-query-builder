const {
  Query,
  Nested
} = require('../');

/*
  EXAMPLE 1
  query {
    user( id: 3500401 ) {
      id,
      nickname: name,
      isViewerFriend,
      profilePicture( size: 50 ) {
        uri,
        width,
        height
      }
    }
  }
*/

const profilePicture = new Query('profilePicture', {
  size: 50
});
profilePicture.select('uri', 'width', 'height');
const user = new Query('user', {
  id: 3500401
});
user.select(['id', {
  nickname: 'name'
}, 'isViewerFriend', {
  image: profilePicture
}]);

console.log('user', user + '');

/*
  EXAMPLE 2
  query {
    FetchLeeAndSam {
      lee: user(id: '1') {
        name
      }
      sam: user(id: '2') {
        name
      }
    }
  }
*/

const FetchLeeAndSam = new Query('FetchLeeAndSam');

const lee = new Nested('user', {
  id: '1'
});
lee.setAlias('lee');
lee.select({
  name: true
});

console.log('lee', lee.toString());

const sam = new Nested('user', 'sam');
sam.filter({
  id: '2'
});
sam.select('name');
console.log('sam', sam + '');

console.log(FetchLeeAndSam.select(lee, sam) + '');
