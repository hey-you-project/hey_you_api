/*jshint node: true*/
'use strict';

var Dot = require('../models/dot');

module.exports = function(app) {
    app.get('/api/dots/all', function(req, res) {
        Dot.find({}, function(err, data) {
            if (err) {
                console.log(err);
                return res.status(500).send('there was an error');
            }
            res.json(data);
        });
    });

    app.get('/api/dots', function(req, res) {
        console.log('PRINTING zone:', req.headers.zone);
        console.log('PRINTING AND PARSING zone:', JSON.parse(req.headers.zone));
        /*
        {"latMax":47.61070610565,"longMin":-122.3387206914,"longMax":-122.3254213086,"latMin":47.60171189435}
        */
        //console.log('PRINTING HEADERS:', req.headers);
        //console.log(JSON.parse(req.headers.Zone));
        res.json(req);
//        Dot.find({latitude:{ $gt: req.body.minLat, $lt: req.body.maxLat},
//               longitude: {$gt: req.body.minLong, $lt: req.body.maLong}},
//              function(err, data) {
//            if (err) {
//                console.log(err);
//                return res.status(500).send('there was an error');
//            }
//            res.json(data);
//        });
    });

    app.post('/api/dots', function(req, res) {
        var dot = new Dot(req.body);
        dot.save(function(err, data) {
            if (err) {
                console.log(err); // for dev only
                return res.status(500).send('there was an error');
            }
            res.json({msg: 'success!'});
        });
    });
};