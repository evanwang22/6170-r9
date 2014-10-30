var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/r9');

module.exports = db;