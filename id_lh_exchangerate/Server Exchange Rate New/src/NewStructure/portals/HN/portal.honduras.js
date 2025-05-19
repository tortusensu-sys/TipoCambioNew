/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')

class ExchangeRateHonduras extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            console.log('date ga', date)
            const dateFormated = Utils.getFormatDateHN(date)
            console.log('url', `https://bchapi-am.azure-api.net/api/v1/indicadores/619/cifras/${dateFormated}?formato=Json`)
            // if (new Date() > newDate) return
            const resultContext = []
            const requestBuy = await fetch(`https://bchapi-am.azure-api.net/api/v1/indicadores/619/cifras/${dateFormated}?formato=Json`, {
                method: 'GET',
                // Request headers
                headers: {
                    'Cache-Control': 'no-cache',
                    clave: 'c048ba8900d84dacbffa3b6301102a1a'
                }
            })
            const requestSale = await fetch(`https://bchapi-am.azure-api.net/api/v1/indicadores/620/cifras/${dateFormated}?formato=Json`, {
                method: 'GET',
                // Request headers
                headers: {
                    'Cache-Control': 'no-cache',
                    clave: 'c048ba8900d84dacbffa3b6301102a1a'
                }
            })
            if (requestBuy.status !== 200 && requestSale.status !== 200) {
                const dateMinusOne = Utils.getDateMinusOneDay(dateFormated)

                return this.getExchangeRates(dateMinusOne)
            }
            const responseBuy = await requestBuy.json()
            const responseSale = await requestSale.json()

            if (!responseBuy.Valor && !responseSale.Valor) {
                const auxDate = Utils.getFormatDateHN(Utils.getDateMinusOneDay(dateFormated))
                return this.getExchangeRates(auxDate)
            }
            resultContext.push({
                compra: responseBuy.Valor,
                venta: responseSale.Valor,
                nomenclatura: 'HNL',
                namePortal: 'Banco Central de Honduras'
            })
            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateHonduras
