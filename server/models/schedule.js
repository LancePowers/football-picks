var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Schedule = new Schema({
    teams: {},
})


module.exports = mongoose.model('schedules', Schedule);
