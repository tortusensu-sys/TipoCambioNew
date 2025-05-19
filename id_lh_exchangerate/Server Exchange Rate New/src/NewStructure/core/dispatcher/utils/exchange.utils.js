function getCurrentDate() {
    const objDate = new Date()
    const utc = objDate.getTime() + objDate.getTimezoneOffset() * 60000
    return new Date(utc + 3600000 * '-5')
}

function getCurrentTimeFormat() {
    let objDate = new Date()
    const utc = objDate.getTime() + objDate.getTimezoneOffset() * 60000
    objDate = new Date(utc + 3600000 * '-5')
    const time =
        `${objDate.getHours().toString().length > 1 ? objDate.getHours() : '0' + objDate.getHours()}` +
        `:${objDate.getMinutes().toString().length > 1 ? objDate.getMinutes() : '0' + objDate.getMinutes()}` +
        `:${objDate.getSeconds().toString().length > 1 ? objDate.getSeconds() : '0' + objDate.getSeconds()}`
    return time
}

module.exports = {
    getCurrentDate,
    getCurrentTimeFormat
}
