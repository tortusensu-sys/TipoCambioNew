/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')
const { XMLParser } = require('fast-xml-parser')

class ExchangeRateGuatemala extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        try {
            const resultContext = []
            const url = 'https://www.banguat.gob.gt/variables/ws/tipocambio.asmx'
            const data = `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
                <TipoCambioRango xmlns="http://www.banguat.gob.gt/variables/ws/">
                <fechainit>${date}</fechainit>
                <fechafin>${date}</fechafin>
                </TipoCambioRango>
            </soap:Body>
            </soap:Envelope>`
            const headers = new Headers()
            headers.append('Content-Type', 'text/xml')
            headers.append('SOAPAction', 'http://www.banguat.gob.gt/variables/ws/TipoCambioRango')
            const requestBuyAndSale = await fetch(url, {
                body: data,
                method: 'POST',
                mode: 'cors',
                headers
            })
            const responseBuyAndSale = await requestBuyAndSale.text()
            const xmlParsed = new XMLParser().parse(responseBuyAndSale)

            const results = xmlParsed['soap:Envelope']['soap:Body']?.TipoCambioRangoResponse?.TipoCambioRangoResult?.Vars?.Var

            if (!xmlParsed['soap:Envelope']['soap:Body']?.TipoCambioRangoResponse?.TipoCambioRangoResult?.Vars) {
                // throw new Error('Tipo de cambio no disponible')
                return this.getExchangeRates(Utils.getDateMinusOneDay(date))
            }
            resultContext.push({
                compra: results?.compra,
                venta: results?.venta,
                nomenclatura: 'GTQ',
                namePortal: 'Banco Central de Guatemala'
            })

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateGuatemala
