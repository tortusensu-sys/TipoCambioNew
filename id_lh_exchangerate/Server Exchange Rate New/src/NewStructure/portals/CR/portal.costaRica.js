/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')
const axios = require('axios')

class ExchangeRateCostaRica extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            const resultContext = []

            const dateSearch = Utils.getDateSearchCR(date)

            const obj = Utils.getFormatDateCR(date)

            let wsChannel = 'https://gee.bccr.fi.cr/indicadoreseconomicos/Cuadros/frmVerCatCuadro.aspx?CodCuadro=400&Idioma=1'
            wsChannel += '&FecInicial=' + obj.dateStart
            wsChannel += '&FecFinal=' + obj.dateEnd
            wsChannel += '&Filtro=0'

            let bodyResponse = await axios.get(wsChannel)

            bodyResponse = bodyResponse.data

            if (bodyResponse.length > 0) {
                if (bodyResponse.indexOf('COMPRA') > -1) {
                    bodyResponse = bodyResponse.split('theTable400')[1]
                    bodyResponse = bodyResponse.split('<td width="200">')[1]
                    bodyResponse = bodyResponse.split('<table id="theTable2400"')[0]

                    let fields = bodyResponse.split('table')[1]
                    let list_compra = bodyResponse.split('table')[4]
                    let list_venta = bodyResponse.split('table')[8]

                    let compra = 0
                    let venta = 0

                    if (fields.indexOf(dateSearch) > -1) {
                        list_compra = list_compra.split('td')
                        list_venta = list_venta.split('td')
                        fields = fields.split('td')

                        const idField = Utils.filterById(fields, dateSearch)

                        compra = list_compra[idField].split('\r\n')
                        venta = list_venta[idField].split('\r\n')
                        compra = parseFloat(compra[compra.length - 2].replace(',', '.'))
                        venta = parseFloat(venta[venta.length - 2].replace(',', '.'))
                    }

                    resultContext.push({
                        compra,
                        venta,
                        nomenclatura: 'CRC',
                        namePortal: 'Banco Central de Costa Rica'
                    })
                } else throw Error('There are not response // No se encontró respuesta')
            } else throw Error('There are not response // No se encontró respuesta')

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateCostaRica
