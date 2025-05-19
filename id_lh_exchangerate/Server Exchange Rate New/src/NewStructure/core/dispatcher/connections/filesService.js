const config = require('../config.js')
const extConnection = require('./connection.js')

function uploadErrorScreenshot(WS_URL, encodedFile, fileName, description, folderName) {
    extConnection
        .doRequest(
            WS_URL,
            {
                imgBase64: encodedFile,
                fileName,
                fileDescription: description,
                folderId: folderName
            },
            'post',
            {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'lmry-account': config.LMRY_ACCOUNT,
                'lmry-action': 'uploadErrorImagenOfBundles'
            }
        )
        .then((response) => {
            // eslint-disable-next-line no-unused-expressions
            JSON.parse(response.body) ? console.info(JSON.parse(response.body)) : ''
        })
        .catch((error) => console.error('ERROR screenshot url:::::::' + error))
}

module.exports = {
    uploadErrorScreenshot
}
