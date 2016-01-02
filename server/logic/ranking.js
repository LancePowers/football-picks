var Stat = require('../models/stats');
var Schedule = require('../models/schedule');
var request = require('request');
var fs = require('fs');

var newWeek = new Week();

Stat.findOne({
    week: 17
}, function (err, res) {
    newWeek.populateTeams(res);
});

Schedule.findOne({
    week: 17
}, function (err, res) {
    newWeek.populateGames(res.teams);
});


function Week() {
    this.teams = [];
    this.schedule = [];
    this.games = [];
    this.picks = [];
}

Week.prototype.populateTeams = function (stats) {
    for (var i = 0; i < stats.teams.length; i++) {
        var newTeam = new Team(stats.teams[i], stats.scores[i]);
        newTeam.toAbbrev();
        this.teams.push(newTeam);
    }
}

Week.prototype.populateGames = function (schedule) {
    for (var i = 0; i < schedule.length; i++) {
        var home = this.findTeam(schedule[i].home);
        var away = this.findTeam(schedule[i].away);
        var newGame = new Game(home, away);
        newGame.calculateSpread();
        this.games.push(newGame);
    }
    var rankedGames = this.rankGames();
    for (var i = 0; i < rankedGames.length; i++) {
        rankedGames[i].weight = i + 1;
    };
    var teamIndex = 0;
    for (var i = 0; i < this.games.length; i++) {
        var homeAway;
        if (this.games[i].home.full === this.games[i].favorite.full) {
            homeAway = 1;
        } else if (this.games[i].away.full === this.games[i].favorite.full) {
            homeAway = 0;
        }
        for (var j = 0; j < rankedGames.length; j++) {
            if (rankedGames[j].favorite === this.games[i].favorite) {
                this.games[i].weight = rankedGames[j].weight;
            }
        }
        this.games[i].inputIndex = teamIndex + homeAway;
        teamIndex += 2;
        console.log(this.games[i].weight, this.games[i].favorite)
    }

}

Week.prototype.findTeam = function (name) {
    for (var i = 0; i < this.teams.length; i++) {
        if (this.teams[i].full === name) {
            return this.teams[i];
        }
    }
}

Week.prototype.rankGames = function () {
    var rankedGames = [];
    var broncosIndex = null;
    for (var i = 0; i < this.games.length; i++) {
        rankedGames.push(this.games[i]);
    }

    rankedGames.sort(function (a, b) {
        if (a.spread > b.spread) {
            return 1;
        }
        if (a.spread < b.spread) {
            return -1;
        }
        return 0;
    });
    for (var i = 0; i < rankedGames.length; i++) {
        if (rankedGames[i].home.full === 'Denver') {
            rankedGames[i].favorite === rankedGames[i].home;
            broncosIndex = i;
        } else if (rankedGames[i].away.full === 'Denver') {
            rankedGames[i].favorite === rankedGames[i].away;
            broncosIndex = i;
        }
    }
    if (broncosIndex !== null) {
        var broncos = rankedGames.splice(broncosIndex, 1);
        rankedGames.push(broncos[0]);
    }

    return rankedGames;
}

function Game(home, away) {
    this.home = home;
    this.away = away;
    this.spread = null;
    this.points = null;
    this.favorite = null;
    this.inputIndex = null;
    this.weight = null;
}

Game.prototype.calculateSpread = function () {
    if (this.home.score > this.away.score) {
        this.favorite = this.home;
    } else {
        this.favorite = this.away;
    }
    this.spread = Math.abs(this.home.score - this.away.score);
}

function Team(name, score) {
    //    this.id = id; // Need to get team IDs from poolhost.com
    this.name = name;
    this.score = score;
    this.full = null;
}

Team.prototype.toAbbrev = function () {
    var teamKeys = [
        {
            full: 'Arizona',
            abbv: "ARI"
        },
        {
            full: 'New York (A)',
            abbv: "NYJ"
        },
        {
            full: 'Pittsburgh',
            abbv: "PIT"
        },
        {
            full: 'Cincinnati',
            abbv: "CIN"
        },
        {
            full: 'Green Bay',
            abbv: "GB"
        },
        {
            full: 'New England',
            abbv: "NE"
        },
        {
            full: 'Denver',
            abbv: "DEN"
        },
        {
            full: 'Carolina',
            abbv: "CAR"
        },
        {
            full: 'Tennessee',
            abbv: "TEN"
        },
        {
            full: 'Atlanta',
            abbv: "ATL"
        },
        {
            full: 'Dallas',
            abbv: "DAL"
        },
        {
            full: 'Kansas City',
            abbv: "KC"
        },
        {
            full: 'Washington',
            abbv: "WAS"
        },
        {
            full: 'Buffalo',
            abbv: "BUF"
        },
        {
            full: 'Miami',
            abbv: "MIA"
        },
        {
            full: 'St. Louis',
            abbv: "STL"
        },
        {
            full: 'Baltimore',
            abbv: "BAL"
        },
        {
            full: 'New York (N)',
            abbv: "NYG"
        },
        {
            full: 'San Diego',
            abbv: "SD"
        },
        {
            full: 'Jacksonville',
            abbv: "JAC"
        },
        {
            full: 'Cleveland',
            abbv: "CLE"
        },
        {
            full: 'Detroit',
            abbv: "DET"
        },
        {
            full: 'Seattle',
            abbv: "SEA"
        },
        {
            full: 'Minnesota',
            abbv: "MIN"
        },
        {
            full: 'Oakland',
            abbv: "OAK"
        },
        {
            full: 'Philadelphia',
            abbv: "PHI"
        },
        {
            full: 'San Francisco',
            abbv: "SF"
        },
        {
            full: 'Houston',
            abbv: "HOU"
        },
        {
            full: 'Indianapolis',
            abbv: "IND"
        },
        {
            full: 'Tampa Bay',
            abbv: "TB"
        },
        {
            full: 'New Orleans',
            abbv: "NO"
        },
        {
            full: 'Chicago',
            abbv: "CHI"
}
            ];
    for (var i = 0; i < teamKeys.length; i++) {
        if (this.name === teamKeys[i].abbv) {
            this.full = teamKeys[i].full;
        }
    }
}

module.exports = {
    Game: Game,
    Team: Team,
    Week: Week,
    newWeek: newWeek
}