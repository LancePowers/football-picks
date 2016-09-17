var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Team = new Schema({
    created: Date,
    teams: {},
})


module.exports = mongoose.model('teams', Team);
