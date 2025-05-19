/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')
const axios = require('axios')

class ExchangeRateColombia extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            const resultContext = []
            let value = null

            const token = 'SYhaErELmCTqpQGHGPGYYmYgw'

            const dateObj = Utils.getFormatDateCO(date)
            const dateFormat = Utils.getFormatDateCo_Ad(date)

            const urlHttpAd = 'https://www.superfinanciera.gov.co/CargaDriver/index.jsp'
            const headerObjAd = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json'
                }
            }

            const urlHttp = "https://www.datos.gov.co/resource/mcec-87by.json?$where=vigenciadesde between '" + dateObj.from + "' and '" + dateObj.to + "'"
            const headerObj = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                    'X-App-Token': token
                }
            }

            const bodyResponseAd = await axios.get(urlHttpAd, headerObjAd)
            const bodyResponse = await axios.get(urlHttp, headerObj)

            if (bodyResponseAd.data.indexOf(dateFormat) > -1) {
                let template = bodyResponseAd.data.split('COP')[1]
                template = template.split('center">')[1]
                value = template.split('</td> ')[0].replace(',', '')
            } else if (bodyResponse.data) {
                value = bodyResponse.data

                if (value.length > 0) {
                    value = value[0]
                    value = value.valor
                } else throw Error('There are not response // no se encontro respuesta')
            } else throw Error('There are not response // no se encontro respuesta')

            resultContext.push({
                compra: parseFloat(value),
                venta: parseFloat(value),
                nomenclatura: 'COP',
                namePortal: 'Banco de la República'
            })

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateColombia
