# Hey You _API_

[![Build Status](https://travis-ci.org/hey-you-project/hey_you_api.svg?branch=master)](https://travis-ci.org/hey-you-project/hey_you_api)

###RESTful server api for hey you hosted on [heroku](https://hey-you-api.herokuapp.com)

API address : `https://hey-you-api.herokuapp.com`

Dots
===========
####Retrieving all dots - *TEMPORARY*

_**GET**_ /v1/api/dots/all

_Returns array of all dot objects_
```
[
    {
        "_id": "324comment1id2348790",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071063,
        "title": "HEY SEATTLE",
        "latitude": 47.623,
        "longitude": -122.333,
        "post": "download this app!",
        "__v": 0,
        "hidden": false,
        "stars": []
    },
    {
        "_id": "203comment2id092384",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071064,
        "title": "YO",
        "latitude": 47.312,
        "longitude": -122.373,
        "post": "this is awesome!",
        "__v": 0,
        "hidden": false,
        "stars": []
    }
]
```

===========
####Getting zone of dots

_**GET**_ /v1/api/dots

Headers: `zone: {"latMax":50,"longMin":-125,"longMax":-120,"latMin":45}`

_Returns array of dots in zone_
```
[
    {
        "_id": "324comment1id2348790",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071063,
        "title": "HEY SEATTLE",
        "latitude": 47.623,
        "longitude": -122.333,
        "post": "download this app!",
        "__v": 0,
        "hidden": false,
        "stars": []
    }
]
```

===========
####Getting dot by id

_**GET**_ /v1/api/dots/dot_id

_Returns single dot object of given id and comments_
```
{
    "_id": "324comment1id2348790",
    "user_id": "101testmanid010",
    "username": "testman",
    "time": 1416445071063,
    "title": "HEY SEATTLE",
    "latitude": 47.623,
    "longitude": -122.333,
    "post": "download this app!",
    "__v": 0,
    "hidden": false,
    "stars": [],
    "comments": [
        {
            "_id": "234879commentid293847",
            "user_id": "101testmanid010",
            "dot_id": "324comment1id2348790",
            "text": "listen to testman. he knows.",
            "__v": 0
        }
    ]
}
```

===========
Users Routes
===========
####Create User

_**POST**_ /api/users

Body:
```
{
  "username": "testman",
  "password": "testpassword",
  "birthday": 1,
  "email": "test@example.com"
}
```

_Returns jwt token_
```
{
    "jwt": "alkvnpefTHISdfaibISbvrawfAaweifjFAKEalskdfwaoHASHoiouaslfjakwjef"
}
```

===========
####Login

_**GET**_ /api/users

`username: "testman", password: "testpassword"`

_Returns jwt token_

===========
Authenticated Routes
===========
*Requires Auth* Headers: `jwt: alkvnpefTHISdfaibISbvrawfAaweifjFAKEalskdfwaoHASHoiouaslfjakwjef`
===========
####Creating a dot

_**POST**_ /v1/api/dots

Body (*JSON*):
```
{
  "longitude": "-122.333",
  "latitude": "47.623",
  "title": "HEY SEATTLE",
  "post": "download this app!",
  "color": "blue"
}
```
_Returns _id and time_
```
{
    "dot_id": "275FAKEID1738",
    "time": 1416445071063
}
```

===========
####Commenting on a dot

_**POST**_ /v1/api/comments/dot_id

Body(*JSON*):
`{"text": "listen to testman. he knows things."}`

_Returns comment message on success_
`"listen to testman. he knows things."`

===========
####Getting users dots

_**GET**_ /v1/api/dots/mydots

_Returns array of dots for that user_
```
[
    {
        "_id": "324comment1id2348790",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071063,
        "title": "HEY SEATTLE",
        "latitude": 47.623,
        "longitude": -122.333,
        "post": "download this app!",
        "__v": 0,
        "hidden": false,
        "stars": []
    },
    {
        "_id": "203comment2id092384",
        "user_id": "101testmanid010",
        "username": "testman",
        "time": 1416445071064,
        "title": "YO",
        "latitude": 47.312,
        "longitude": -122.373,
        "post": "this is awesome!",
        "__v": 0,
        "hidden": false,
        "stars": []
    }
]
```
===========
####Delete a dot - *NOT TESTED*

_**DELETE**_ /v1/api/dots/_id

_Removes dot of id _id_
