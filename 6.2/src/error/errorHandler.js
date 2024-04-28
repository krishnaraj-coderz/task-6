const checkError = (error,req,res,next)=>{
    console.log(error)
    clientErrors = ["MongoServerError","ValidationError","Invalid Password","NotFoundError"]
    if(clientErrors.includes(error.name)|| clientErrors.includes(error.message)){
        res.status(error.status || 400).json({
            status:"error",
            message:error.message.split(":")[0]
        })
    }
    else{
        res.status(500).json({
            status:"fail",
            message:"Internal Server Error"
        })
    }
}

module.exports = checkError