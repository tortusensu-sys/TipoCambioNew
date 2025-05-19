/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')
const axios = require('axios')

class ExchangeRateBrasil extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            let resultContext = []

            const datestart = Utils.getFormatDateBR(date)

            const urlHttp = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?' + "@dataCotacao='" + datestart + "'&$format=json"

            const response = await axios.get(urlHttp)

            let bodyResponse = response.data
            bodyResponse = bodyResponse.value

            let venta = 0
            let compra = 0
            let newDate = ''

            let flag = false

            if (bodyResponse.length > 0) {
                venta = bodyResponse[0].cotacaoVenda
                compra = bodyResponse[0].cotacaoCompra
            } else {
                const array_date = date.split('/')
                newDate = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
                newDate.setDate(newDate.getDate() - 1)
                const day = newDate.getDate()
                const month = newDate.getMonth() + 1
                const year = newDate.getFullYear()

                newDate = day + '/' + month + '/' + year

                resultContext = this.getExchangeRates(newDate)
                flag = true
            }

            if (!flag) {
                resultContext.push({
                    compra: parseFloat(compra),
                    venta: parseFloat(venta),
                    nomenclatura: 'BRL',
                    namePortal: 'Banco Central de Brasil'
                })
            }

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateBrasil
