class customError extends Error{
    constructor(message = "Internal Server Error",statusCode=500){
        this();
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.contructor)
    }
}

module.exports = customError