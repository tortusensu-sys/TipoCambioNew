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
            const resultContext = []
            const responseBuy = await this.buy(date, '619')
            const responseSale = await this.buy(date, '620')
            console.log('responseBuy.Valor', responseBuy.Valor)
            console.log('responseSale.Valor', responseSale.Valor)
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

    async buy(date, indicator) {
        const dateFormated = Utils.getFormatDateHN(date)
        const requestBuy = await fetch(`https://bchapi-am.azure-api.net/api/v1/indicadores/${indicator}/cifras/${dateFormated}?formato=Json`, {
            method: 'GET',
            // Request headers
            headers: {
                'Cache-Control': 'no-cache',
                clave: 'c048ba8900d84dacbffa3b6301102a1a'
            }
        })

        if (requestBuy.status === 500) {
            return this.buy(date, indicator)
        } else if (requestBuy.status === 404) {
            const dateMinusOne = Utils.getDateMinusOneDay(dateFormated)

            return this.buy(dateMinusOne, indicator)
        }
        const responseBuy = await requestBuy.json()
        if (!responseBuy.Valor) {
            const auxDate = Utils.getFormatDateHN(Utils.getDateMinusOneDay(dateFormated))
            return this.buy(auxDate, indicator)
        }
        return responseBuy
    }

    // async sale(date) {
    //     const dateFormated = Utils.getFormatDateHN(date)
    //     const requestSale = await fetch(`https://bchapi-am.azure-api.net/api/v1/indicadores/620/cifras/${dateFormated}?formato=Json`, {
    //         method: 'GET',
    //         // Request headers
    //         headers: {
    //             'Cache-Control': 'no-cache',
    //             clave: 'c048ba8900d84dacbffa3b6301102a1a'
    //         }
    //     })

    //     if (requestSale.status === 500) {
    //         return this.sale(date)
    //     } else if (requestSale.status === 404) {
    //         const dateMinusOne = Utils.getDateMinusOneDay(dateFormated)

    //         return this.sale(dateMinusOne)
    //     }
    //     const responseSale = await requestSale.json()
    //     if (!responseSale.Valor) {
    //         const auxDate = Utils.getFormatDateHN(Utils.getDateMinusOneDay(dateFormated))
    //         return this.sale(auxDate)
    //     }
    //     return responseSale
    // }
}

module.exports = ExchangeRateHonduras
