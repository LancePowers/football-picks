var express = require('express');
var request = require('request');
var routes = express();
var cheerio = require('cheerio');
var Q = require('q');
var Teams = require('../models/teams');
// Get schedule
/*
Game get schedule
 - ID
 - Home
 - away
 - Time
 - Station
 Team get injuries
- playerId
*/
routes.get('/teams', function (request, response) {
  console.log('/teams')
    fantasyData({serviceType:'nfl-teams',week:''})
    .then(getPicks)
    .then(function(res){
      teams = res.teams.NFLTeams;
      for (var i = 0; i < teams.length; i++) {
        var pickScore = addPicksToTeam(teams[i], res.experts)
        teams[i].pickScore = pickScore;
        console.log('TEAM'+ i)
      }
      console.log('We Got Picks')
      return teams
    })
    .then(function(teams){
      console.log('Finding Saved Data')
      var deferred = Q.defer();
      Teams.findOne({}, {}, { sort: { 'created' : -1 } }, function (err, res) {
        console.log('FROM TEAM FIND',res);
          if (err) {
              console.log(err)
          } else {

            if(res == undefined){
              console.log('Created = undefined')
              deferred.resolve(getStats(teams))
            } else if ((Date.now()-res.created)/1000/60 <  24 * 60) {
              console.log((Date.now()-res.created)/1000/60)
              deferred.resolve(res.teams)
              console.log('Created != undefined')
            } else {
              deferred.resolve(getStats(teams))
            }
          }
      })
      return deferred.promise
    })
   .then(function(teams){
     response.send(teams)
   })
});

routes.get('/injuries', function (request, response) {
  console.log('/injuries')
  fantasyData({serviceType:'schedule',week:''})
  .then(function(res){
    return fantasyData({serviceType:'injuries',week:res.currentWeek})
  })
  .then(function(res){
    response.send(res)
  })
});

routes.get('/games', function (request, response) {
  console.log('/games')
  fantasyData({serviceType:'schedule',week:''})
    .then(function(res){
      var games = [];
      for (var i = 0; i < res.Schedule.length; i++) {
        if (res.Schedule[i].gameWeek === res.currentWeek){
          games.push(res.Schedule[i])
        }
      }
      return games
    })
    .then(function(games){
      response.send(games)
    })
})

function addPicksToTeam(team, experts){
  console.log('Preparing to Add Picks to the Team');
  var expertPoints = 0;
  for (var i = 0; i < experts.length; i++) {
    for (var j = 0; j < experts[i].picks.length; j++) {
      if(experts[i].picks[j] === team.code){
        expertPoints += parseFloat(experts[i].accuracy)
      }
    }
  }
  console.log('Adding Picks to the Team');
  return expertPoints
}

function fantasyData(data){
   // service type 'weather, injuries, schedule, weekly-rankings'
  var deferred = Q.defer()
  var url = 'http://www.fantasyfootballnerd.com/service/'+data.serviceType+'/json/kjeu4uigaauj/'+ data.week;
  request(url, function (error, response) {
    deferred.resolve(JSON.parse(response.body))
  })
  return deferred.promise;
}

function getStats(teams) {
  var deferred = Q.defer();
  console.log('Football Outsiders Data Requested')
  url = 'http://www.footballoutsiders.com/stats/teameff';
  request(url, function (error, response, html) {
    console.log('Football Outsiders Data Collected')
      if (!error) {
          var $ = cheerio.load(html);
          var team, score;
          var data = {
              teams: [],
              scores: []
          };
          $(".stats").first().children().each(function () {
              data.scores.push($(this).children().eq(4).text())
          });
          $(".stats").first().children().each(function () {
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
              if(data.teams[j] === teams[i].code){
                teams[i].statScore = data.scores[j];
              }
            }
          }
          var newTeam = new Teams({created:Date.now(),teams:teams})
          newTeam.save(function (err, res) {
              if (err) {
                  console.log(err)
              } else {
                  console.log(
                      // 'SUCCESS', res
                      'SAVED successfully'
                  );
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
  request(url, function (error, response, html) {
      var experts = [];
      if (!error) {
          var $ = cheerio.load(html);
          for (var i = 0; i < $(".info-row").length; i++) {
            var expert = $(".info-row")[i];
            var picks = getExpertPicks(expert, $);
            var name = $(expert).children().eq(1).children().text();
            var accuracy = $(expert).children().last().text();
            if(picks.use){
              experts.push({name:name,picks:picks.picks,accuracy:accuracy})
            }
          }
      }
      deferred.resolve({experts: experts, teams: teams})
  })
  return deferred.promise;
}

function getExpertPicks(item, $){
  var picks = [];
  var count = 0;
  for (var i = 0; i < $(item).children().length; i++) {
    var child = $(item).children()[i];
    if ($(child).children().attr('class') !== undefined) {
      var itemClass = $(child).children().attr('class')
      var index = itemClass.indexOf('displogo')
      if(index !== -1){
        if (itemClass.slice(0,index-1)=='LAR') {
          picks.push('LA');
        } else if (itemClass.slice(0,index-1)=='AZ') {
          picks.push('ARI');
        } else if (itemClass.slice(0,index-1)=='JAX') {
          picks.push('JAC');
        } else {
          picks.push(itemClass.slice(0,index-1))
          count++;
        }
      }
    }
  }
  if(count >= 14){
    return {use: true, picks: picks};
  } else {
    return {use: false};
  }
}
exports = module.exports = routes;
