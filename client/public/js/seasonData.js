(function () {
    'use strict';

    angular
        .module('app')
        .factory('seasonData', seasonData);

    seasonData.$inject = [];

    function seasonData() {
        var service = {};
        service.matrix = matrixInit()
            // 4 = 2 divisional games, 2 = 1 home game, 1 = 1 away game
        var teams = ['Packers', 'Vikings', 'Bears', 'Lions', 'Redskins', 'Giants', 'Cowboys', 'Eagles', 'Falcons', 'Panthers', 'Saints', 'Buccaneers', '49ers', 'Seahawks', 'Rams', 'Cardinals', 'Ravens', 'Bengals', 'Steelers', 'Browns', 'Patriots', 'Dolphins', 'Jets', 'Bills', 'Texans', 'Colts', 'Titans', 'Jaguars', 'Broncos', 'Chargers', 'Raiders', 'Chiefs'];

        function matrixInit() {
            var matrix = []
            for (var i = 0; i < 32; i++) {
                var row = [];
                for (var j = 0; j < 32; j++) {
                    row.push(0);
                }
                matrix.push(row)
            }
            return matrix
        }


        function teamIndex(team) {
            return teams.indexOf(team);
        }

        //returns an array of weeks games
        function findGamesByWeek(games, week) {
            var response = [];
            for (var i = 0; i < games.length; i++) {
                if (games[i].week - 1 === week) {
                    response.push(games[i]);
                }
            }
            return response;
        }


        function findPicksByWeek(picks, week) {
            var response = [];
            for (var i = 0; i < picks.length; i++) {
                if (picks[i].week - 1 === week) {
                    return picks[i].games;
                }
            }
        }

        // picks for each
        // find games in that week
        // games for each 
        // if home === team
        // return points
        // else if away === team 
        // return points
        // else return 1




        function addToMatrix(obj) {
            service.matrix[obj.pick][obj.opponent] += obj.pts + 1;
            service.matrix[obj.opponent][obj.pick] += 1;
        }


        function matchTeam(pickWeek, gameWeek) {
            for (var i = 0; i < pickWeek.length; i++) {
                if (pickWeek[i].pick === gameWeek[i].away_team) {
                    addToMatrix({
                        pick: teamIndex(gameWeek[i].away_name),
                        opponent: teamIndex(gameWeek[i].home_name),
                        pts: pickWeek[i].points
                    })
                }
                if (pickWeek[i].pick === gameWeek[i].home_team) {
                    addToMatrix({
                        pick: teamIndex(gameWeek[i].home_name),
                        opponent: teamIndex(gameWeek[i].away_name),
                        pts: pickWeek[i].points
                    })
                }
            }
        }

        service.init = function (data) {
            for (var i = 0; i < 17; i++) {
                var games = findGamesByWeek(data.season, i);
                var picks = findPicksByWeek(data.picks, i);
                matchTeam(picks, games);
            }

            console.log(service.matrix[28]);
            visual(service.matrix)
        }
        return service;
    }
})()




//            away_ats_result: "lose"
//            away_city: "Cleveland"
//            away_name: "Browns"
//            away_score: 10
//            away_team: "CLE"
//            game_time: "2015-09-13 13:00:00"
//            home_city: "New York"
//            home_name: "Jets"
//            home_score: 31
//            home_team: "NYJ"
//            week: "1"
//            year: "2015"