/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager.js')
// const PortalManager = require('../PortalManager.js')

class TestinPeru extends ExchangeManager {
    constructor(name) {
        super(name)
    }

    async run() {
        return await this.name
    }

    apache(raw) {
        return `Esto es una respuesta de ${raw}`
    }
}
module.exports = TestinPeru
