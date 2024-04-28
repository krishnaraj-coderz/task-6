module.exports = (Schema, Types, Model) => {
    const salarySchema = new Schema({
        "employeeName": {
            type: String,
            required: true
        },
        "creditedDate": {
            type: Date
        },
        "salaryAmount": {
            type: Number
        },

    })
    const salarydetail = Model("salaryDetail", salarySchema)
    return salarydetail
}