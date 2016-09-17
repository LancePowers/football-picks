var express = require('express');
var request = require('request');
var routes = express();
var cheerio = require('cheerio');
var Q = require('q');
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
    fantasyData({serviceType:'nfl-teams',week:''})
    .then(getPicks)
    .then(function(res){
      teams = res.teams.NFLTeams;
      for (var i = 0; i < teams.length; i++) {
        var pickScore = addPicksToTeam(teams[i], res.experts)
        teams[i].pickScore = pickScore;
      }
      // console.log(teams)
      return teams
    })
   .then(getStats)
   .then(function(res){
     var stats = res.stats;
     teams = res.teams.map(function(team){
       for (var i = 0; i < stats.teams.length; i++) {
         if(stats.teams[i] === team.code){
           team.statScore = stats.scores[i];
           return team;
         }
       }
     })
   })
   .then(function(){
     return fantasyData({serviceType:'schedule',week:''})
   })
   .then(function(res){
     return fantasyData({serviceType:'injuries',week:res})
   })
   .then(function(res){
     for (var i = 0; i < teams.length; i++) {
       teams[i].injuries = res.Injuries[teams[i].code]
     }

   })
   .then(function(){
       response.send(teams)
   })
});

routes.get('/games', function (request, response) {
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
  var expertPoints = 0;
  for (var i = 0; i < experts.length; i++) {
    for (var j = 0; j < experts[i].picks.length; j++) {
      if(experts[i].picks[j] === team.code){
        expertPoints += parseFloat(experts[i].accuracy)
      }
    }
  }
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
  url = 'http://www.footballoutsiders.com/stats/teameff';
  request(url, function (error, response, html) {

      if (!error) {
          var $ = cheerio.load(html);
          var team, score;
          var data = {
              teams: [],
              scores: []
          };
          $(".stats").first().children().each(function () {
              data.scores.push($(this).children().eq(3).text())
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
          deferred.resolve({stats:data,teams:teams})
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
      console.log(experts)
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
