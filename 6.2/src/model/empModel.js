module.exports =  (Schema,model) =>{
    const employeeSchema = new Schema({
        userName: {
            type:String,
            required:true,
            uniqure:true
        },
        email:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        },
        hashedPassword:{
            type:String
        },
        mobileNumber:{
            type:String,
            required:true
        },
        domain:{
            type:String,
            required:true
        },
        hireDate:{
            type:Date,
            required:true
        },
        role:{
            type:String,
            enum:["employee","management"],
            required:true,
            default:"employee"
        },
        // salaries:[{
        //     type:Schema.Types.ObjectId,
        //     ref:"salaryDetail",
        //     refpath:"salary_id"
        // }]
    })
    const employeeDetail = model('employeeDetail', employeeSchema)
    return employeeDetail
}