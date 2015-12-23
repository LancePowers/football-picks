var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var routes = express();
var mongoose = require('mongoose');
var Stat = require('../models/stats');
var Schedule = require('../models/schedule');
var ranking = require('../logic/ranking');
var submit = require('../logic/submit');

routes.get('/stats', function (req, res) {
    url = 'http://www.footballoutsiders.com/stats/teameff';

    console.log('here');
    request(url, function (error, response, html) {

        if (!error) {
            var $ = cheerio.load(html);

            var team, score;
            var json = {
                teams: [],
                scores: []
            };

            $(".stats").first().children().each(function () {
                json.scores.push($(this).children().eq(4).text())
            });

            $(".stats").first().children().each(function () {
                json.teams.push($(this).children().eq(1).text())
            });
            for (var i = 0; i < json.teams.length; i++) {
                json.scores[i] = parseFloat(json.scores[i])
            };

            json.teams.splice(17, 1);
            json.teams.splice(0, 1);
            json.scores.splice(17, 1);
            json.scores.splice(0, 1);

            var newStat = new Stat({
                week: 16,
                teams: json.teams,
                scores: json.scores
            });
            newStat.save(function (err, stat) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(
                        'SUCCESS', stat
                    );
                }
            })
        }

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
    })
})

routes.get('/picks', function (req, res) {
    res.send(ranking.newWeek.teams)
})

routes.get('/games', function (req, res) {
    console.log('here');
    url = 'http://www2.poolhost.com/index.asp?page=nflsched.asp';
    request(url, function (error, response, html) {

        if (!error) {

            var $ = cheerio.load(html);

            var week = 16;
            var teams = [];
            var games = [];

            $(".team > a > b").each(function () {
                teams.push($(this).text())
            })

            while (teams.length) {
                var game = {
                    away: teams.splice(0, 1)[0],
                    home: teams.splice(0, 1)[0],
                }
                games.push(game);
            }

            var newSchedule = new Schedule({
                week: week,
                teams: games
            });
            newSchedule.save(function (err, res) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(res)
                };
            })
            res.send(teams);


        }
    })
})


//routes.listen('3000');
console.log('Magic happens on port 8081');
exports = module.exports = routes;