const https = require('https')
const request = require('request-promise')

function reqRequest(url, reqBody, method, headers) {
    return request({
        method,
        url,
        headers,
        body: reqBody,
        json: true,
        followAllRedirects: true
    }).then((response) => {
        return response
    })
}

function doRequest(url, reqBody, method, headers) {
    const options = {
        method,
        headers,
        maxRedirects: 3,
        maxBodyLength: 20 * 1024 * 1024
    }
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let body = ''
            res.on('data', (chunk) => (body += chunk.toString()))
            res.on('error', reject)
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body
                    })
                } else {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject('Request failed. status: ' + res.statusCode + ', body: ' + body)
                }
            })
        })
        req.on('error', reject)
        console.debug('reqBody', reqBody)
        req.write(JSON.stringify(reqBody))
        req.end()
    })
}

module.exports = {
    doRequest,
    reqRequest
}
