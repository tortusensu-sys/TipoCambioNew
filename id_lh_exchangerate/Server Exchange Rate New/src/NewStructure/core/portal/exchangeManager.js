/* eslint-disable prefer-const */
const { BadRequest } = require('../dispatcher/core/errorHandler.js')
const { saveData } = require('../dispatcher/components/services.js')
const logLbry = require('../dispatcher/lib/log.lib.js')
const { io } = require('../dispatcher/server/configPackages.js')
const exchangeUtils = require('../dispatcher/utils/exchange.utils.js')
const axios = require('axios')

class ExchangeManager {
    constructor(data) {
        this.data = data
        this.timeExecute = []
        this.portal = data.portal || null
        this.isNotScheduled = null
        this.month = null
        this.year = null
        this.currencyTo = data.currencyTo || null
        this.currencyFrom = data.currencyFrom || null
        this.errorCount = 0
        this.timezone = data.timezone || 'UTC'
    }

    getSchedule() {
        const { hours, minutes } = this.data
        return hours.map((h, i) => {
            const hour = h.padStart(2, '0')
            const minute = minutes[i].padStart(2, '0')
            return {
                cron: `${minute} ${hour} * * *`,
                timezone: this.timezone,
                portalId: this.portal
            }
        })
    }

    async obtainData() {
        try {
            this.validateData()
            this.transformData()

            const dataBank = []
            const currencyTo = this.currencyTo
            const currencyFrom = this.currencyFrom
            let namePortal = null
            let dayLength = 0

            if (this.isNotScheduled) {
                if (new Date(this.year, this.month, 0) <= new Date()) {
                    dayLength = Number(new Date(this.year, this.month, 0).getDate())
                } else {
                    dayLength = Number(new Date().getDate())
                }
            } else {
                dayLength = Number(new Date().getDate())
            }
            console.log('dayLength', dayLength)
            for (let i = 1; i <= dayLength; i++) {
                await this.setDataFromService(i, dataBank, this, namePortal)
            }

            const dataRequest = {
                portal: this.portal,
                rates: {}
            }

            dataBank.forEach((line) => {
                this.setCurrencies(line, dataRequest, currencyTo, currencyFrom)
            })

            // if (dataRequest.rates[currencyFrom].length > 0) {
            //     await this.sendDataSuitelet(dataRequest, currencyTo, currencyFrom)
            // }

            this.errorCount = 0

            const response = dataBank.map((line) => {
                const result = {
                    portal: {
                        id: this.portal,
                        name: line.namePortal
                    },
                    fecPublica: line.fecPublica,
                    valTipo: line.valTipo,
                    codTipo: line.codTipo
                }

                return result
            })
            console.log('response', response)
            return response
        } catch (e) {
            this.errorCount++
            console.log('Error corriendo portal', e)
            if (this.errorCount < 5) {
                await new Promise((resolve, reject) => setTimeout(resolve, 1000 * 60 * 5))
                await this.obtainData()
            } else {
                console.error('Error en la peticion', e.response ? e.response.data : e)
                axios
                    .post('https://chat.googleapis.com/v1/spaces/AAAAv7K96R8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zVKshDUMFyZseIKxDgl1V0CVhqKIrUHFguuadStgLH8%3D', {
                        cardsV2: [
                            {
                                cardId: 'unique-card-id',
                                card: {
                                    header: {
                                        title: 'ERROR EN PORTAL ' + this.portal,
                                        subtitle: 'latamready@latamready.com',
                                        imageUrl: 'https://i.ibb.co/TgF88kY/descarga.png',
                                        imageType: 'CIRCLE'
                                    },
                                    sections: [
                                        {
                                            header: 'DETALLES',
                                            widgets: [
                                                {
                                                    decoratedText: {
                                                        text: e.stack ? e.stack.toString() : e.toString()
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    })
                    .then(function(response) {
                        // console.log(response);
                    })
                    .catch(function(error) {
                        console.error(error.toJSON())
                    })

                logLbry.emitDetails(`${exchangeUtils.getCurrentTimeFormat()} => Unexpected error: ${e.message}`, io)

                this.errorCount = 0
            }
        }
    }

    async setDataFromService(index, dataBank, params, namePortal) {
        const { portal, year } = params
        let { month } = params
        let day = ''
        let valVenta = null
        let valCompra = null

        if (month < 10) month = '0' + month
        else month = month.toString()

        if (index < 10) day = '0' + index
        else day = index

        const dateIndex = day + '/' + month + '/' + year

        if (portal === 5 || portal === 7 || portal === 8 || portal === 10) {
            if (index + 1 < 10) day = '0' + (Number(day) + 1)
            else day = '' + (Number(day) + 1)
        }

        const date = day + '/' + month + '/' + year
        const response = await this.getExchangeRates(date)
        console.log('response', response)
        namePortal = response[0].namePortal
        response[0].venta = isNaN(response[0].venta) ? null : response[0].venta
        response[0].compra = isNaN(response[0].compra) ? null : response[0].compra

        let newResponse = null
        let resVenta = response[0].venta

        if (dataBank.length === 0) {
            if (!response[0].venta) {
                let count = 0

                while (resVenta == null) {
                    const prevMonthIndex = Number(new Date(year, month - 1, count).getDate())
                    let newMonth = Number(new Date(year, month - 1, count).getMonth()) + 1
                    const newYear = Number(new Date(year, month - 1, count).getFullYear())

                    if (newMonth < 10) newMonth = '0' + newMonth
                    else newMonth = newMonth.toString()

                    const newDate = prevMonthIndex + '/' + newMonth + '/' + newYear
                    newResponse = await this.getExchangeRates(newDate)
                    namePortal = newResponse[0].namePortal

                    resVenta = newResponse[0].venta
                    count--
                }

                valVenta = isNaN(newResponse[0].venta) ? '' : newResponse[0].venta.toString()
                valCompra = isNaN(newResponse[0].compra) ? '' : newResponse[0].compra.toString()
            } else {
                valVenta = response[0].venta.toString()
                valCompra = response[0].compra.toString()
            }
        } else {
            if (response[0].venta) {
                valVenta = response[0].venta.toString()
                valCompra = response[0].compra.toString()
            } else {
                valVenta = dataBank[dataBank.length - 2].valTipo
                valCompra = dataBank[dataBank.length - 1].valTipo
            }
        }
        dataBank.push({
            fecPublica: dateIndex,
            valTipo: valVenta,
            codTipo: 'V',
            namePortal
        })

        dataBank.push({
            fecPublica: dateIndex,
            valTipo: valCompra,
            codTipo: 'C',
            namePortal
        })
        return dataBank
    }

    async getExchangeRates(date) {
        throw new Error('Validando el apache')
    }

    validateData() {
        const { hours, minutes, isNotScheduled, portal } = this.data
        console.log('Estamos usando el portal', portal)
        if (!portal) throw new BadRequest("The param 'portal' is required.")
        if (!isNotScheduled) {
            if (!hours || hours.length === 0) throw new BadRequest("The param 'hours' is required.")

            if (!minutes || minutes.length === 0) throw new BadRequest("The param 'minutes' is required.")
        }
        // else {
        //     if (!month) throw new BadRequest("The param 'month' is required.")

        //     if (!year) throw new BadRequest("The param 'year' is required.")
        // }
    }

    transformData() {
        const input = this.data

        if (typeof input.hours === 'object' && typeof input.minutes === 'object') {
            input.hours.forEach((line, index) => {
                this.timeExecute.push(`${line}:${input.minutes[index]}`)
            })
        } else if (typeof input.hours === 'object') {
            input.hours.forEach((hours) => {
                this.timeExecute.push(`${hours}:${input.minutes}`)
            })
        } else if (typeof input.minutes === 'object') {
            input.minutes.forEach((minutes) => {
                this.timeExecute.push(`${input.hours}:${minutes}`)
            })
        } else {
            this.timeExecute = `${input.hours}:${input.minutes}`
        }

        this.portal = input.portal
        this.isNotScheduled = input.isNotScheduled

        this.month = Number(new Date().getMonth()) + 1
        this.year = Number(new Date().getFullYear())
        // esto se comenta, esta en la version original, mi sucesor que averigua para que chu sirve
        // if (this.isNotScheduled) {
        //     this.month = input.month
        //     this.year = input.year
        // } else {
        //     this.month = Number(new Date().getMonth()) + 1
        //     this.year = Number(new Date().getFullYear())
        // }
    }

    setCurrencies(line, dataRequest, country, currency) {
        let typeChange = null
        if (line.codTipo === 'V') typeChange = 1
        else typeChange = 2
        if (!dataRequest.rates[currency]) dataRequest.rates[currency] = []
        dataRequest.rates[currency].push({
            date: line.fecPublica,
            from: currency,
            to: country,
            type: typeChange,
            value: line.valTipo
        })

        dataRequest.rates[currency].push({
            date: line.fecPublica,
            from: country,
            to: currency,
            type: typeChange,
            value: 1 / line.valTipo
        })

        dataRequest.rates[currency].sort(function(a, b) {
            if (a.date < b.date) return -1
            if (a.date > b.date) return 1
            if (a.type < b.type) return -1
            if (a.type > b.type) return 1

            return 0
        })
    }

    async sendDataSuitelet(dataRequest, currencyFrom, currencyTo) {
        console.log('sendDataSuitelet', dataRequest.rates[currencyTo].length)
        let body = {
            portal: dataRequest.portal,
            rates: dataRequest.rates[currencyTo],
            currencyFrom,
            currencyTo
        }
        return await saveData(body)
            .then((response) => {
                return JSON.parse(response.body)
            })
            .catch((error) => {
                console.error('error:', error)
            })
    }
}

module.exports = ExchangeManager
