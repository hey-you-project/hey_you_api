# Hey You _API_

[![Build Status](https://travis-ci.org/hey-you-project/hey_you_api.svg)](https://travis-ci.org/hey-you-project/hey_you_api)

###RESTful server api for hey you hosted on [heroku](https://hey-you-api.herokuapp.com)

API address : `https://hey-you-api.herokuapp.com`

Dots
===========
####Retrieving all dots

_**GET**_ /v1/api/dots/all

_Returns array of all dot objects_

e.g.
```
[ { _id: '546a554c22a87d56158a54cc',
    latitude: 1,
    longitude: 2,
    color: 'green',
    title: 'hey you with the shoe',
    body: 'nice shoes',
    username_id: 'theshoeguy',
    __v: 0,
    time: '2014-11-17T20:06:36.231Z',
    comments: [] },
  { _id: '546a55da9b1f9e6f159d72a0',
    latitude: 2,
    longitude: 3,
    color: 'red',
    title: 'hey you in the blue',
    body: 'thanks',
    username_id: 'yourfriendlyneighborhoodspiderman',
    __v: 0,
    time: '2014-11-17T20:08:58.456Z',
    comments: [] },
  { _id: '546a565b9b1f9e6f159d72a1',
    latitude: 20,
    longitude: 30,
    color: 'purple',
    title: 'sup brah',
    body: 'howzit',
    username_id: 'braddah',
    __v: 0,
    time: '2014-11-17T20:11:07.100Z',
    comments: [] } ]
```

===========
####Getting zone of dots

_**GET**_ /v1/api/dots

Headers: `zone: {"latMax":4,"longMin":-1,"longMax":4,"latMin":-1}`

_Returns array of dots_

e.g.
```
[{ _id: '546a554c22a87d56158a54cc',
    latitude: 1,
    longitude: 2,
    color: 'green',
    title: 'hey you with the shoe',
    body: 'nice shoes',
    username_id: 'theshoeguy',
    __v: 0,
    time: '2014-11-17T20:06:36.231Z',
    comments: [] },
  { _id: '546a55da9b1f9e6f159d72a0',
    latitude: 2,
    longitude: 3,
    color: 'red',
    title: 'hey you in the blue',
    body: 'thanks',
    username_id: 'yourfriendlyneighborhoodspiderman',
    __v: 0,
    time: '2014-11-17T20:08:58.456Z',
    comments: [] }]
```

===========
####Getting dot by id

_**GET**_ /v1/api/dots/_id

_Returns single dot object with id of _id_

===========
####Creating a dot

_**POST**_ /v1/api/dots

*Requires Auth* 

Headers: `jwt: #token`

Body:
```
{
  "latitude": "30",
  "longitude": "20",
  "color": "green",
  "title": "its me",
  "body": "you had me at hello",
  "username_id": "smokeyjoe"
}
```
_Returns _id and time_

===========
####Commenting on a dot

_**PUT**_ /v1/api/dots/_id

*Requires Auth* 

Headers: `jwt: #token`

Body: `{"text": "I like to comment"}`

===========
####Delete a dot

_**DELETE**_ /v1/api/dots/_id

*Requires Auth* 

Headers: `jwt: #token`

_Removes dot of id _id_

===========
Users
===========
####Create User

_**POST**_ /api/users

Body:
```
{
  "username": "mightyjoe",
  "password": "joemighty",
  "birthday": "123456790",
  "email": "mightjoey@example.com"
}
```

_Returns jwt token_

===========
####Login

_**GET**_ /api/users

`username: "mightyjoe", password: "joemighty"`

_Returns jwt token_
