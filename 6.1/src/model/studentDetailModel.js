module.exports = (Schema, model) => {
    const studentSchema = new Schema({
        rollNumber: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: [true, "name is a required field"],
        },
        department: {
            type: String,
            required: true
        },
        contact: {
            type: [String],
            required: true
        },
        gender: {
            type: String
        },
        DOB: {
            type: Date
        }
    },
        { timeStamps: true })
    const studentDetail = model("studentDetails", studentSchema)
    return studentDetail
}