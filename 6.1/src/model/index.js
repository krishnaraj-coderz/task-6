const {Schema, model} = require("mongoose") 

const db = {}
db.studentDetail = require("./studentDetailModel")(Schema, model);

module.exports = db;
