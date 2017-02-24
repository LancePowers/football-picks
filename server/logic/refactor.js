var express = require('express');
var request = require('request');
var routes = express();
var cheerio = require('cheerio');
var Q = require('q');
var Teams = require('../models/teams');
// Get schedule
// {gameId: '98',
//        gameWeek: '7',
//        gameDate: '2016-10-23',
//        awayTeam: 'CLE',
//        homeTeam: 'CIN',
//        gameTimeET: '1:00 PM',
//        tvStation: 'CBS',
//        winner: 'CIN' },

routes.get('/season', function(request, response) {
    fantasyData({serviceType: 'schedule', week:''}).then(function(games){
      // console.log(games.Schedule.length)
      var deferred = Q.defer()
      Teams.find(function(err, res) {
          if (err) {
              console.log(err)
          } else {
            // console.log(res.length)
            deferred.resolve({teams:res, games:games})
          }
      })
      return deferred.promise
    }).then(function(obj){
      var teams = dedupWeeks(obj.teams);
      // console.log(teams)
      var schedule = matchWeek(obj.games, teams);
      console.log(schedule, ' Schedule')
      response.send(schedule)
    })
})

function matchWeek(games,weeks) {
  var filteredWeek = []
  var matchedGames = [];
  var gameWeek = games.Schedule[i].gameWeek;
  // console.log(games.Schedule.length)
  console.log(gameWeek, new Date(Date.now()).getWeek())
  for (var i = 0; i < games.Schedule[i].length; i++) {
    console.log(i)
    if (gameWeek > 1 && gameWeek <= new Date(Date.now()).getWeek()) {
      var g = matchTeams(games.Schedule[i], weeks[gameWeek - 2]);
      // console.log(game)
      matchedGames.push(g);
    }
  }
  console.log(matchedGames)
  return matchedGames
}

function matchTeams(game, week) {
  console.log(week.teams.length)
  for (var i = 0; i < week.teams.length; i++) {
    if (week.teams[i].code === game.awayTeam){
      game.awayTeamStats = week.teams[i];
    } else if (week.teams[i].code === game.homeTeam){
      game.homeTeamStats = week.teams[i];
    }
    // console.log(i)
  }
  return game;
}

function dedupWeeks(teams) {
    var season = [];
    for (var i = 0; i < teams.length; i++) {
        var d = new Date(teams[i].created).getWeek() - 35;
        if (i == 0) {
            season.push({teams: teams[i].teams, week: d})
        } else if (d !== season[season.length - 1].week) {
            season.push({teams: teams[i].teams, week: d})
        }
    }
    return season;
}

routes.get('/teams', function(request, response) {
    console.log('/teams')
    fantasyData({serviceType: 'nfl-teams', week: ''}).then(getPicks).then(function(res) {
        teams = res.teams.NFLTeams;
        for (var i = 0; i < teams.length; i++) {
            var pickScore = addPicksToTeam(teams[i], res.experts)
            teams[i].pickScore = pickScore;
            console.log(pickScore)
        }
        console.log('We Got Picks')
        return teams
    }).then(function(teams) {
        console.log('Finding Saved Data')
        var deferred = Q.defer();
        Teams.findOne({}, {}, {
            sort: {
                'created': -1
            }
        }, function(err, res) {
            console.log('FROM TEAM FIND', res);
            if (err) {
                console.log(err)
            } else {
                if (res == undefined) {
                    console.log('Created = undefined')
                    deferred.resolve(getStats(teams))
                } else if ((Date.now() - res.created) / 1000 / 60 < 1) {
                    console.log((Date.now() - res.created) / 1000 / 60)
                    deferred.resolve(res.teams)
                    console.log('Created != undefined')
                } else {
                    deferred.resolve(getStats(teams))
                }
            }
        })
        return deferred.promise
    }).then(function(teams) {
        response.send(teams)
    })
});

routes.get('/injuries', function(request, response) {
    console.log('/injuries')
    fantasyData({serviceType: 'schedule', week: ''}).then(function(res) {
        return fantasyData({serviceType: 'injuries', week: res.currentWeek})
    }).then(function(res) {
        response.send(res)
    })
});

routes.get('/games', function(request, response) {
    console.log('/games')
    fantasyData({serviceType: 'schedule', week: ''}).then(function(res) {
        var games = [];
        console.log(res.Schedule)
        for (var i = 0; i < res.Schedule.length; i++) {
            if (res.Schedule[i].gameWeek === res.currentWeek) {
                games.push(res.Schedule[i])
            }
        }
        return games
    }).then(function(games) {
        response.send(games)
    })
})

function addPicksToTeam(team, experts) {
    console.log('Preparing to Add Picks to the Team');
    var expertPoints = 0;
    for (var i = 0; i < experts.length; i++) {
        for (var j = 0; j < experts[i].picks.length; j++) {
            if (experts[i].picks[j] === team.code) {
                expertPoints += parseFloat(experts[i].accuracy)
            }
        }
    }
    console.log('Adding Picks to the Team');
    return expertPoints
}

function fantasyData(data) {
    // service type 'weather, injuries, schedule, weekly-rankings'
    var deferred = Q.defer()
    var url = 'http://www.fantasyfootballnerd.com/service/' + data.serviceType + '/json/kjeu4uigaauj/' + data.week;
    request(url, function(error, response) {
        deferred.resolve(JSON.parse(response.body))
    })
    return deferred.promise;
}

function getStats(teams) {
    var deferred = Q.defer();
    console.log('Football Outsiders Data Requested')
    url = 'http://www.footballoutsiders.com/stats/teameff';
    request(url, function(error, response, html) {
        console.log('Football Outsiders Data Collected')
        if (!error) {
            var $ = cheerio.load(html);
            var team,
                score;
            var data = {
                teams: [],
                scores: []
            };
            $(".stats").first().children().each(function() {
                data.scores.push($(this).children().eq(4).text())
            });
            $(".stats").first().children().each(function() {
                if ($(this).children().eq(1).text() === 'LARM') {
                    data.teams.push('LA');
                } else {
                    data.teams.push($(this).children().eq(1).text())
                }
            });
            for (var i = 0; i < data.teams.length; i++) {
                data.scores[i] = parseFloat(data.scores[i])
            };
            data.teams.splice(17, 1);
            data.teams.splice(0, 1);
            data.scores.splice(17, 1);
            data.scores.splice(0, 1);
            for (var i = 0; i < teams.length; i++) {
                for (var j = 0; j < data.teams.length; j++) {
                    if (data.teams[j] === teams[i].code) {
                        teams[i].statScore = data.scores[j];
                    }
                }
            }
            var newTeam = new Teams({created: Date.now(), teams: teams})
            newTeam.save(function(err, res) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(
                    // 'SUCCESS', res
                    'SAVED successfully');
                }
            })
            deferred.resolve(teams)
        }
    })
    return deferred.promise;
}

function getPicks(teams) {
    url = 'http://nflpickwatch.com/';
    var deferred = Q.defer();
    request(url, function(error, response, html) {
        var experts = [];
        if (!error) {
            var $ = cheerio.load(html);
            for (var i = 0; i < $(".info-row").length; i++) {
                var expert = $(".info-row")[i];
                var picks = getExpertPicks(expert, $);
                console.log(picks)
                var name = $(expert).children().eq(1).children().text();
                var accuracy = $(expert).children().last().text();
                if (picks.use) {
                    experts.push({name: name, picks: picks.picks, accuracy: accuracy})
                }
            }
        }
        deferred.resolve({experts: experts, teams: teams})
    })
    return deferred.promise;
}

function getExpertPicks(item, $) {
    var picks = [];
    var count = 0;
    for (var i = 0; i < $(item).children().length; i++) {
        var child = $(item).children()[i];
        if ($(child).children().attr('class') !== undefined) {
            var itemClass = $(child).children().attr('class')
            var index = itemClass.indexOf('displogo')
            if (index !== -1) {
                if (itemClass.slice(0, index - 1) == 'LAR') {
                    picks.push('LA');
                } else if (itemClass.slice(0, index - 1) == 'AZ') {
                    picks.push('ARI');
                } else if (itemClass.slice(0, index - 1) == 'JAX') {
                    picks.push('JAC');
                } else {
                    picks.push(itemClass.slice(0, index - 1))
                    count++;
                }
            }
        }
    }
    if (count >= 13) {
        return {use: true, picks: picks};
    } else {
        return {use: false};
    }
}

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}
exports = module.exports = routes;
