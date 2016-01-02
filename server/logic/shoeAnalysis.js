var Stat = require('../models/stats');
var Schedule = require('../models/schedule');
var request = require('request');
var fs = require('fs');



var allPicks = []

Schedule.findOne({
    week: 17
}, createIndividualPicks);

function createIndividualPicks(err, res) {
    var mom = [7, 12, 9, 14, 13, 10, 4, 5, 8, 1, 15, 3, 16, 11, 6, 2];
    var sharty = [4, 13, 5, 14, 12, 9, 6, 3, 8, 1, 16, 10, 15, 11, 2, 7];
    var lance = [4, 14, 2, 12, 15, 5, 8, 11, 3, 1, 10, 13, 16, 6, 9, 7];
    var momPick = [false, false, true, true, false, true, true, false, true, false, true, true, true, true, false, false];
    var lancePick = [false, false, true, true, false, true, true, false, true, false, true, true, true, false, false, false];
    var shartyPick = [false, false, true, true, false, true, true, true, true, true, true, true, true, true, false, true];

    res.teams.forEach(function (game, index) {
        console.log(game)
        var gamePick = {
            win: true,
            home: game.home,
            away: game.away,
            default: pickTeam(game, momPick[index]),
            mom: {
                pick: pickTeam(game, momPick[index]),
                weight: mom[index]
            },
            lance: {
                pick: pickTeam(game, lancePick[index]),
                weight: lance[index]
            },
            sharty: {
                pick: pickTeam(game, shartyPick[index]),
                weight: sharty[index]
            }
        }

        allPicks.push(gamePick);
    })
    console.log(allPicks)
    return (allPicks);
}

function pickTeam(game, pick) {
    if (pick) {
        return game.home;
    } else {
        return game.away;
    }
}

module.exports = allPicks;