class moongoseError extends Error{
    constructor(message){
        super();
        this.statusCode = 400
        this.status = "fail";
        this.message = message
        Error.captureStackTrace(this,this.constructor)
    }
}

module.exports = moongoseError
