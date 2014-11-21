# Hey You _API_

[![Build Status](https://travis-ci.org/hey-you-project/hey_you_api.svg?branch=master)](https://travis-ci.org/hey-you-project/hey_you_api)

###RESTful server api for hey you hosted on [heroku](https://hey-you-api.herokuapp.com)

API address : `https://hey-you-api.herokuapp.com`

Users Routes
===========
####Create User :

_**POST**_ /api/users

Body:
```
{ "username": "testman",
  "password": "testpassword",
  "birthday": 1,
  "email": "test@example.com" }
```

_Returns jwt token_
```
{ "jwt": "alkvnpefTHISdfaibISbvrawfAaweifjFAKEalskdfwaoHASHoiouaslfjakwjef" }
```

####Login :

_**GET**_ /api/users

`username: "testman", password: "testpassword"`

_Returns jwt token_

Dots
===========
####Retrieving all dots - *TEMPORARY* :

_**GET**_ /v1/api/dots/all

_Returns array of all dot objects_
```
[ {     "_id": "324comment1id2348790",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071063,
        "title": "HEY SEATTLE",
        "color": "blue",
        "latitude": 47.623,
        "longitude": -122.333,
        "post": "download this app!",
        "__v": 0,
        "hidden": false,
        "stars": [] }, {...} ]
```

####Getting zone of dots :

_**GET**_ /v1/api/dots

Headers: 
`zone: {"latMax":50,"longMin":-125,"longMax":-120,"latMin":45}`

_Returns array of dots in zone_
```
[ { _id: '546eaa0618b26cfe16365e0f',
    user_id: '546eaa0618b26cfe16365e0c',
    username: 'dotUser',
    time: 1416538630645,
    color: 'green',
    title: 'Hey you, with the coffee',
    latitude: 47.6097,
    longitude: -122.3331,
    post: 'I am in Seattle',
    __v: 0,
    views: 2,
    hidden: false,
    starred: false }, {...} ]
```

####Getting dot by id :

_**GET**_ /v1/api/dots/dot_id

*note:* jwt header is optional. If set, the API will check if the user has stared the dot.

_Returns single dot object of given id and comments_
```
{ _id: '546eaae6a45f8b021729bddb',
  user_id: '546eaae6a45f8b021729bdd8',
  username: 'dotUser',
  time: 1416538854538,
  color: 'green',
  title: 'Hey you, with the coffee',
  latitude: 47.6097,
  longitude: -122.3331,
  post: 'I am in Seattle',
  __v: 0,
  views: 3,
  hidden: false,
  starred: false,
  stars: 0,
  comments: 
   [ { _id: '546eaae6a45f8b021729bddd',
       timestamp: 1416538854611,
       username: 'dotUser',
       user_id: '546eaae6a45f8b021729bdd8',
       dot_id: '546eaae6a45f8b021729bddb',
       text: 'this is a text comment from the OP',
       __v: 0 },
     { _id: '546eaae6a45f8b021729bdde',
       timestamp: 1416538854622,
       username: 'dotUser2',
       user_id: '546eaae6a45f8b021729bdd9',
       dot_id: '546eaae6a45f8b021729bddb',
       text: 'this is a text comment from another user',
       __v: 0 } ] }
```
####Getting user's dot by id :

_**GET**_ /v1/api/dots/mydots

*jwt required in header*

_Returns array dot objects made from the user_
```
[ { _id: '546eb21a9bd55e171793a195',
    user_id: '546eb2199bd55e171793a193',username: 'dotUser',
    time: 1416540698148,
    color: 'blue',
    title: 'Hey you, with the startup',
    latitude: 37.7833,
    longitude: -122.4167,
    post: 'I am in San Fransico',
    __v: 0,
    hidden: false,
    starred: false }, {...} ]
```

===========

####Creating a dot :

_**POST**_ /v1/api/dots

*jwt required in header*

Body (*JSON*):
```
{ "longitude": "-122.333",
  "latitude": "47.623",
  "title": "HEY SEATTLE",
  "post": "download this app!",
  "color": "blue" }
```
_Returns _id and time_
```
{ "dot_id": "275FAKEID1738",
  "time": 1416445071063 }
```
===========
####Delete a dot :

_**DELETE**_ /v1/api/dots/_id

*jwt required in header*

_Removes dot of id _id_

===========
####Commenting on a dot :

_**POST**_ /v1/api/comments/dot_id

Body(*JSON*):
`{"text": "listen to testman. he knows things."}`

_Returns comment message on success_
`"listen to testman. he knows things."`

####Deleting a comment :

_**DELETE**_ /v1/api/comments/dot_id

*jwt required in header*

_Returns 'removed!' message on success_
`removed!`

===========
####Getting users dots :

_**GET**_ /v1/api/dots/mydots

*jwt required in header*

_Returns array of dots for that user_
```
[ {     "_id": "324comment1id2348790",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071063,
        "title": "HEY SEATTLE",
        "color": "blue",
        "latitude": 47.623,
        "longitude": -122.333,
        "post": "download this app!",
        "__v": 0,
        "hidden": false,
        "stars": [] },
    {   
        "_id": "203comment2id092384",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071064,
        "title": "YO",
        "green": "green",
        "latitude": 47.312,
        "longitude": -122.373,
        "post": "this is awesome!",
        "__v": 0,
        "hidden": false,
        "stars": [] } ]
```
===========
####Toggle a user's star

_**POST**_ /v1/api/stars/_id

*jwt required in header*

_Adds a star or deletes a star based on user history_