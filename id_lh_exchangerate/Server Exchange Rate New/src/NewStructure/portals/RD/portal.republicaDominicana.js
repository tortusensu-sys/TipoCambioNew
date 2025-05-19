/* eslint-disable no-useless-catch */
/* eslint-disable camelcase */
/* eslint-disable no-useless-constructor */
const ExchangeManager = require('../../core/portal/exchangeManager')
const Utils = require('../../utils/utils')
const axios = require('axios')
const { CookieJar } = require('tough-cookie')
// const fetch = require('node-fetch')
const qs = require('qs')

class ExchangeRateRepublicaDominicana extends ExchangeManager {
    constructor(data) {
        super(data)
    }

    async getExchangeRates(date) {
        console.log('date formant ga', date)
        let responsePost = null
        let status = 0
        let dateElemnet = Utils.getDateCRUSD(date)
        console.log('dateElemnet', dateElemnet)
        const urlGet = 'https://www.bancentral.gov.do/SectorExterno/HistoricoTasas'
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
            Referer: urlGet,
            Origin: 'https://www.bancentral.gov.do'
        }
        try {
            const jar = new CookieJar()
            const response = await axios.get(urlGet, {
                headers,
                withCredentials: true,
                jar,
                validateStatus: () => true
            })

            const setCookies = response.headers['set-cookie'] || []
            setCookies.forEach(cookie => jar.setCookieSync(cookie, urlGet))

            const getCookies = await jar.getCookieString('https://www.bancentral.gov.do')

            const url = 'https://www.bancentral.gov.do/Home/GetHistoricalExchangeRates'

            const realHeaders = {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: getCookies
            }
            const formData = {
                fromDate: dateElemnet,
                toDate: dateElemnet,
                isForReporting: 'true'
            }

            while (status === 0) {
                console.log('dateElemnet', dateElemnet)
                responsePost = await axios.post(url, qs.stringify(formData), {
                    headers: realHeaders,
                    withCredentials: true,
                    jar,
                    validateStatus: () => true
                })
                responsePost = responsePost.data?.result?.items[0]
                if (responsePost) {
                    status = 1
                } else {
                    dateElemnet = Utils.getDayFormant(dateElemnet)
                    formData.fromDate = dateElemnet
                    formData.toDate = dateElemnet

                    console.log('formData', formData)
                }
            }
            return [
                    {
                        compra: responsePost.purchaseValue,
                        venta: responsePost.sellingValue,
                        nomenclatura: 'CRC',
                        date: dateElemnet,
                        namePortal: 'Banco Central Republica Dominicana'
                    }
                ]
        } catch (error) {
            throw error
        }
    }
}

module.exports = ExchangeRateRepublicaDominicana
