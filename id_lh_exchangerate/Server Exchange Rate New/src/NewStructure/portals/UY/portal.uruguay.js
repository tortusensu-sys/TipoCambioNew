/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const https = require('https')
const Utils = require('../../utils/utils')
const axios = require('axios')

class ExchangeRateUruguay extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            let resultContext = []

            let array_date = date.split('/')
            let datestart = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
            datestart.setDate(datestart.getDate() - 1)
            let day = datestart.getDate()
            let month = datestart.getMonth() + 1
            let year = datestart.getFullYear()

            datestart = Utils.zeroFill(day, 2) + '/' + Utils.zeroFill(month, 2) + '/' + year

            const urlHttp = 'https://www.bcu.gub.uy/_layouts/15/BCU.Cotizaciones/handler/CotizacionesHandler.ashx?op=getcotizaciones'
            const headerObj = {
                headers: {
                    'Content-Type': 'application/json'
                },
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                })
            }
            const bodyObj = JSON.stringify({
                KeyValuePairs: {
                    Monedas: [
                        {
                            Val: '2225',
                            Text: 'DLS. USA BILLETE'
                        }
                    ],
                    FechaDesde: datestart,
                    FechaHasta: datestart,
                    Grupo: '2'
                }
            })

            const response = await axios.post(urlHttp, bodyObj, headerObj)

            const objars = JSON.stringify(response.data)

            let compra = 0
            let venta = 0
            let newDate = ''

            let flag = false

            if (objars.indexOf('No existe cotización para la fecha indicada') === -1) {
                const objCoti = JSON.parse(objars).cotizacionesoutlist.Cotizaciones[0]

                compra = objCoti.TCC
                venta = objCoti.TCV
            } else {
                array_date = date.split('/')
                newDate = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
                newDate.setDate(newDate.getDate() - 1)

                day = newDate.getDate()
                month = newDate.getMonth() + 1
                year = newDate.getFullYear()

                newDate = day + '/' + month + '/' + year
                resultContext = this.getExchangeRates(newDate)
                flag = true
            }

            if (!flag) {
                resultContext.push({
                    compra: parseFloat(compra),
                    venta: parseFloat(venta),
                    nomenclatura: 'UYU',
                    namePortal: 'Banco Central de Uruguay'
                })
            }

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateUruguay
