# git-rev + promises

[![npm version](https://badge.fury.io/js/git-rev-promises.svg)](https://badge.fury.io/js/git-rev-promises)

access git revision state in node with promises

# Install

`npm install git-rev-promises`

# Example

## run sample

``` bash
node example/simple.js
```

# Methods

``` js 
var git = require('git-rev-promises')
```

## .short()
return the result of `git rev-parse --short HEAD`

## .long()
return the result of `git rev-parse HEAD`

## .tag()
return the current tag

## .branch()
return the current branch

## .message()
return the last commit message on this branch

## .date()
return the date of the last commit

## .isUpdateToDate()
return where or not you are on the SAME commit as origin

## .count()
return the commit count

## .log()
return the git log of `process.cwd()` as an array

``` js
git.log().then(console.log).catch(console.error)
  //[[
  //  "83d9628821fb3fa83a0540d329051a862d0b7e01",
  //  "Remove code dump from readme + added missing function call info",
  //  "7 hours ago",
  //  "brian"
  //],[
  //  "9309bff7ad5f8fc8e1a9dcdac84d43d0cdff426b",
  //  "Add commit-message command + you can now pass in a string parsing function",
  //  "7 hours ago",
  //  "brian"
  //],[
  //  "1b69da352c8dc3efec347d8be0e80cc849302fd7",
  //  "Adds `date` promise to return date of commit",
  //  "7 hours ago",
  //  "brian"
  //]]

```

# License

(The MIT License)

Copyright (c) 2012/2015 Brian Shannon & Thomas Blobaum <tblobaum@gmail.com> 

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
