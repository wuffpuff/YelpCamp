class ExpressError extends Error { //ExpressError extends to regular built-in error
    constructor(message, statusCode){
        super();
        this.message = message;
        this.statusCode = statusCode
    }
}

module.exports = ExpressError