const TYPE_ERROR = {
    badRequest: 400,
    notFount: 404,
    internalError: 500
}

class BadRequest extends Error {
    constructor(message) {
        super(message)
        this.code = TYPE_ERROR.badRequest
    }
}

class NotFount extends Error {
    constructor(message) {
        super(message)
        this.code = TYPE_ERROR.notFount
    }
}

class InternalError extends Error {
    constructor(message) {
        super(message)
        this.code = TYPE_ERROR.internalError
    }
}

class ErrorHandler {
    constructor(error) {
        console.log('errorr', error)
        if (!error.code || typeof error.code === 'string') {
            this.error = new InternalError(error.message)
        } else {
            this.error = error
        }
    }

    exec(res) {
        return res.status(this.error.code).json({
            status: false,
            message: this.error.message
        })
    }
}

module.exports = {
    BadRequest,
    NotFount,
    InternalError,
    ErrorHandler
}
