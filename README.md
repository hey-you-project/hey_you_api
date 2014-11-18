hey_you_api
===========

[![Build Status](https://travis-ci.org/hey-you-project/hey_you_api.svg)](https://travis-ci.org/hey-you-project/hey_you_api)

RESTful server api for hey you

===========
Retrieving all dots

GET request to https://hey-you-api.herokuapp.com/api/dots/all

Returns
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
Getting zone of dots

GET request to https://hey-you-api.herokuapp.com/api/dots

Header should include
`zone: {"latMax":47.61070610565,"longMin":-122.3387206914,"longMax":-122.3254213086,"latMin":47.60171189435}`

Returns array of dots

===========
Getting dot by id

GET request to https://hey-you-api.herokuapp.com/api/dots/_id

Returns single dot with id of _id

===========
Creating a dot

POST to https://hey-you-api.herokuapp.com/api/dots

json sample to send
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
