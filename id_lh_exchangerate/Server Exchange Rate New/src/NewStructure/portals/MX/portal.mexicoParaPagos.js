/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')
const axios = require('axios')

class ExchangeRateMexicoParaPagos extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            let resultContext = []

            const series = 'SF43718'
            const token = '095390451e43ea612d187d1310b958ed18d7d2724cc2ca8158dee926cd605d1a'

            const datestart = Utils.getFormatDateMXParaPagos(date, 1)
            const dateend = Utils.getFormatDateMXParaPagos(date, 7)

            const urlHttp = 'https://www.banxico.org.mx/SieAPIRest/service/v1/series/' + series + '/datos/' + dateend + '/' + datestart + '?token=' + token

            const headerObj = {
                headers: {
                    Accept: 'application/json'
                }
            }

            let bodyResponse = await axios.get(urlHttp, headerObj)

            bodyResponse = bodyResponse.data
            bodyResponse = bodyResponse.bmx.series

            const json = Array.from(bodyResponse)[0]

            let compra = 0
            let venta = 0
            let newDate = ''

            let flag = false

            if (Object.prototype.hasOwnProperty.call(json, 'datos') && json.datos.length > 2) {
                if (json.datos.length > 0) {
                    const t = json.datos.length

                    venta = json.datos[t - 2].dato
                    compra = json.datos[t - 2].dato
                }
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
                    nomenclatura: 'MXN',
                    namePortal: 'Banxico para Pagos'
                })
            }

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateMexicoParaPagos
