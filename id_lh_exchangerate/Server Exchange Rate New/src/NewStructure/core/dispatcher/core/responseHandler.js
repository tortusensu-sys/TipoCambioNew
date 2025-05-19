const TYPE = {
    success: 200,
    notContent: 204
}

class ResponseHandler {
    constructor(data, message) {
        this.responseBody = { status: true }

        if (data) this.responseBody.data = data
        if (message || !data) this.responseBody.message = message || 'Success'
    }

    send(res) {
        if (this.type === 'success' && !this.responseBody.data) this.type = 'notContent'
        console.log(this.responseBody)
        return res.status(TYPE[this.type]).send(this.responseBody)
    }
}

class SuccessResponse extends ResponseHandler {
    constructor(message, data) {
        super(data, message)
        this.type = 'success'
    }
}

module.exports = {
    SuccessResponse
}
