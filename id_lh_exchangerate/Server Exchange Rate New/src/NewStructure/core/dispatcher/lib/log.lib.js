/* eslint-disable n/no-path-concat */
const fs = require('fs')
const exchangeUtils = require('../utils/exchange.utils.js')
const URLfilePortals = __dirname + '../data/portalLogs.txt'

async function getLog() {
    return new Promise((resolve, reject) => {
        fs.readFile(URLfilePortals, 'utf-8', function(err, data) {
            if (err) console.log(err)
            resolve(data)
        })
    })
}

function setLog(line) {
    fs.appendFile(URLfilePortals, line, { encoding: 'utf8', flag: 'a' }, function(err) {
        if (err) console.log(err)
    })
}

function clearLog(io) {
    fs.writeFile(URLfilePortals, `${exchangeUtils.getCurrentTimeFormat()} => LOG CLEANED \n`, { encoding: 'utf8', flag: 'w' }, function(err) {
        if (err) console.log(err)
    })

    io.emit('serverPortals:reload')
}

function emitDetails(data, io) {
    io.emit('serverPortals:details', { detail: data })
    setLog(`${data} \n`)
}

module.exports = {
    getLog,
    emitDetails,
    clearLog
}
