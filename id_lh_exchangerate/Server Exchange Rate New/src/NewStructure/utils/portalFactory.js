const ExchangeRateChile = require('../portals/CH/portal.chile.js')
const ExchangeRateCostaRica = require('../portals/CR/portal.costaRica.js')
const ExchangeRateUruguay = require('../portals/UY/portal.uruguay.js')
const ExchangeRateBrasil = require('../portals/BR/portal.brasil.js')
const ExchangeRateArgentinaBilletes = require('../portals/AR/portal.argentinaBi.js')
const ExchangeRateArgentinaDivisas = require('../portals/AR/portal.argentinaDi.js')
const ExchangeRateMexicoDOF = require('../portals/MX/portal.mexicoDOF.js')
const ExchangeRateMexico = require('../portals/MX/portal.mexico.js')
const ExchangeRateMexicoParaPagos = require('../portals/MX/portal.mexicoParaPagos.js')
const ExchangeRateColombia = require('../portals/CO/portal.colombia.js')
const ExchangeRateCostaRicaCAD = require('../portals/CR/portal.costaRicaCAD.js')
const ExchangeRateGuatemala = require('../portals/GT/portal.guatemala.js')
const ExchangeRateHonduras = require('../portals/HN/portal.honduras.js')
const ExchangeRateChileUF = require('../portals/CH/portal.chileUF.js')
const ExchangeRateRepublicaDominicana = require('../portals/RD/portal.republicaDominicana.js')

class PortalFactory {
    static createAll() {
        return [
            new ExchangeRateChile({
                hours: ['5'],
                minutes: ['0'],
                isNotScheduled: true,
                timezone: 'America/Santiago',
                currencyTo: 'CLP',
                currencyFrom: 'USD',
                portal: 3
            }),
            new ExchangeRateCostaRica({
                hours: ['6', '7'],
                minutes: ['0', '0'],
                isNotScheduled: true,
                timezone: 'America/Costa_Rica',
                currencyFrom: 'USD',
                currencyTo: 'CRC',
                portal: 4
            }),
            new ExchangeRateUruguay({
                hours: ['4', '5'],
                minutes: ['0', '0'],
                isNotScheduled: true,
                timezone: 'America/Montevideo',
                currencyFrom: 'USD',
                currencyTo: 'UYU',
                portal: 5
            }),
            new ExchangeRateBrasil({
                hours: ['4', '5'],
                minutes: ['0', '0'],
                isNotScheduled: true,
                timezone: 'America/Sao_Paulo',
                currencyFrom: 'USD',
                currencyTo: 'BRL',
                portal: 6
            }),
            new ExchangeRateArgentinaBilletes({
                hours: [
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17'
                ],
                minutes: '0',
                isNotScheduled: false,
                timezone: 'America/Argentina/Buenos_Aires',
                currencyFrom: 'USD',
                currencyTo: 'ARS',
                portal: 7
            }),
            new ExchangeRateArgentinaDivisas({
                hours: [
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17'
                ],
                minutes: '0',
                isNotScheduled: true,
                timezone: 'America/Argentina/Buenos_Aires',
                currencyFrom: 'USD',
                currencyTo: 'ARS',
                portal: 8
            }),
            new ExchangeRateMexicoDOF({
                hours: ['8', '9', '10', '11', '13', '15'],
                minutes: ['0', '0', '0', '0', '0', '0'],
                isNotScheduled: true,
                timezone: 'America/Mexico_City',
                currencyFrom: 'USD',
                currencyTo: 'MXN',
                portal: 9
            }),
            new ExchangeRateMexico({
                hours: ['8', '9', '10', '11', '13', '15'],
                minutes: ['0', '0', '0', '0', '0', '0'],
                isNotScheduled: true,
                timezone: 'America/Mexico_City',
                currencyFrom: 'USD',
                currencyTo: 'MXN',
                portal: 10
            }),
            new ExchangeRateMexicoParaPagos({
                hours: ['8', '9', '10', '11', '13', '15'],
                minutes: ['0', '0', '0', '0', '0', '0'],
                isNotScheduled: true,
                timezone: 'America/Mexico_City',
                currencyFrom: 'USD',
                currencyTo: 'MXN',
                portal: 11
            }),
            new ExchangeRateColombia({
                hours: ['9', '11', '13'],
                minutes: ['0', '0', '0'],
                isNotScheduled: true,
                timezone: 'America/Bogota',
                currencyFrom: 'USD',
                currencyTo: 'COP',
                portal: 12
            }),
            new ExchangeRateCostaRicaCAD({
                hours: ['6'],
                minutes: ['0'],
                isNotScheduled: true,
                timezone: 'America/Costa_Rica',
                currencyFrom: 'CAD',
                currencyTo: 'CRC',
                portal: 13
            }),
            new ExchangeRateGuatemala({
                hours: ['9', '11', '13'],
                minutes: ['0', '0', '0'],
                isNotScheduled: true,
                timezone: 'America/Guatemala',
                currencyFrom: 'USD',
                currencyTo: 'GTQ',
                portal: 14
            }),
            new ExchangeRateHonduras({
                hours: ['9', '11', '13'],
                minutes: ['0', '0', '0'],
                timezone: 'America/Tegucigalpa',
                isNotScheduled: true,
                currencyFrom: 'USD',
                currencyTo: 'HNL',
                portal: 15
            }),
            new ExchangeRateChileUF({
                hours: ['10', '10', '10', '10'],
                minutes: ['5', '10', '15', '30'],
                isNotScheduled: true,
                timezone: 'America/Santiago',
                currencyTo: 'CLP',
                currencyFrom: 'CLF',
                portal: 16
            }),
            new ExchangeRateRepublicaDominicana({
                hours: ['9', '11', '13'],
                minutes: ['0', '0', '0'],
                timezone: 'America/Santo_Domingo',
                isNotScheduled: true,
                currencyFrom: 'USD',
                currencyTo: 'DOP',
                portal: 17
            })
        ]
    }
}

module.exports = PortalFactory
