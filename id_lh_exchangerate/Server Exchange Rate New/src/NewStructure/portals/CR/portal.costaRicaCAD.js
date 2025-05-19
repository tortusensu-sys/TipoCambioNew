/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')

class ExchangeRateCostaRicaCAD extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            const arrayDate = date.split('/')

            const auxDate = new Date(Number(arrayDate[2]), Number(arrayDate[1]) - 1, Number(arrayDate[0]))
            const dateEnd = arrayDate[2] + '-' + Utils.zeroFill(Number(arrayDate[1]), 2) + '-' + Utils.zeroFill(Number(arrayDate[0]), 2)

            auxDate.setDate(auxDate.getDate() - 1)

            const day = auxDate.getDate()
            const month = auxDate.getMonth() + 1
            const year = auxDate.getFullYear()
            const auxDateStart = Utils.zeroFill(day, 2) + '/' + Utils.zeroFill(month, 2) + '/' + year
            const dateStart = year + '-' + Utils.zeroFill(month, 2) + '-' + Utils.zeroFill(day, 2)
            const jsonResponse = await fetch(
                `https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=CAD&quote=CRC&data_type=general_currency_pair&start_date=${dateStart}&end_date=${dateEnd}`
            )
            const jsonResponseParsed = await jsonResponse.json()
            if (jsonResponse.status === 200) {
                const typesExchange = jsonResponseParsed?.response[0]
                return [
                    {
                        compra: typesExchange.average_bid,
                        venta: typesExchange.average_ask,
                        nomenclatura: 'CRC',
                        date: dateEnd,
                        namePortal: 'Banco Central de Costa Rica CAD'
                    }
                ]
            } else {
                return await this.getExchangeRates(auxDateStart)
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateCostaRicaCAD
