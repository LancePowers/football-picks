var express = require('express');
var router = express.Router();
var request = require('request');
var server = require('./server.js');

router.get('/', function (req, res, next) {



    res.end();

});

module.exports = router;