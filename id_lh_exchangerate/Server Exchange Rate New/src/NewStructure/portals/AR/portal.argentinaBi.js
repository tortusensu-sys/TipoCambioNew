/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const axios = require('axios')

class ExchangeRateArgentinaBilletes extends ExchangeManager {
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

            datestart = day + '/' + month + '/' + year

            const urlHttp = 'https://www.bna.com.ar/Cotizador/HistoricoPrincipales'
            const headerObj = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const bodyObj = JSON.stringify({
                id: 'billetes',
                fecha: datestart,
                filtroEuro: 0,
                filtroDolar: 1
            })

            const response = await axios.post(urlHttp, bodyObj, headerObj)

            const objars = response.data

            let compra = 0
            let venta = 0
            let newDate = ''

            let flag = false

            if (objars.indexOf('Le pedimos disculpas, en estos momentos no se puede acceder al sitio del Banco de la Nación Argentina.') === -1) {
                if (objars.indexOf('No hay cotizaciones pendientes para esa fecha.') === -1) {
                    const template = objars.split('cotizacionesCercanas')[1]

                    const regexDate = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g

                    const foundedDates = []

                    let isExistDate = false
                    let match

                    while ((match = regexDate.exec(template)) != null) {
                        foundedDates.push(match[0])
                    }

                    foundedDates.forEach((line) => {
                        if (datestart === line) isExistDate = true
                    })

                    if (isExistDate) {
                        const temp_exch = template.split(datestart)[0].split('class="dest">')
                        const length_exch = temp_exch.length
                        const temp_venta = temp_exch[length_exch - 1]
                        const temp_compra = temp_exch[length_exch - 2]

                        venta = temp_venta.split('</td>')[0].replace(',', '.')
                        compra = temp_compra.split('</td>')[0].replace(',', '.')
                    } else {
                        resultContext = this.getExchangeRates(newDate)
                        flag = true
                    }
                } else {
                    array_date = date.split('/')
                    newDate = new Date(parseInt(array_date[2]), parseInt(array_date[1]) - 1, parseInt(array_date[0]))
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
                        nomenclatura: 'ARS',
                        namePortal: 'Banco Central de la Nación Argentina (Billetes)'
                    })
                }
            } else {
                resultContext.push({
                    Mensaje: 'En estos momentos no se puede acceder. Intentar mas tarde.'
                })
            }

            return resultContext
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateArgentinaBilletes
