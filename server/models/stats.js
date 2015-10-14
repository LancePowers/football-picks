var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Stat = new Schema({
    week: Number,
    teams: [],
    scores: [],
})


module.exports = mongoose.model('stats', Stat);