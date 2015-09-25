var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
    // Let's scrape Anchorman 2
    url = 'http://www.footballoutsiders.com/stats/teameff';

    request(url, function (error, response, html) {

        if (!error) {

            var $ = cheerio.load(html);
            console.log('test');

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
        }
        for (var i = 0; i < json.teams.length; i++) {
            json.scores[i] = parseFloat(json.scores[i])
//            if (isNaN(json.scores[i])) {
    //                json.scores.splice(i, 1);
    //            }
        };



        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
            console.log('File successfully written! - Check your project directory for the output.json file');
        })

        res.send('Check your console!')
    })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;