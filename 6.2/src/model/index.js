const {Schema,Types, model} = require("mongoose")

db = {}
db.employeeDetail = require("./empModel")(Schema,model)
db.salaryDetail = require("./salaryModel")(Schema,Types,model)

module.exports = db
