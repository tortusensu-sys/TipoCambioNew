const puppeteer = require('puppeteer')
async function getSBSExchangeRates() {
    const dataRequest = {
        portal: 1,
        rates: {
            USD: [],
            CAD: [],
            CLP: [],
            GBP: [],
            JPY: [],
            MXN: [],
            CHF: [],
            EUR: []
        }
    }
    const browser = await puppeteer.launch({
        headless: false
        // slowMo: 100 // Uncomment to visualize test
    })
    const page = await browser.newPage()

    // Load "https://www.sbs.gob.pe/app/pp/sistip_portal/paginas/publicacion/tipocambiopromedio.aspx"
    await page.goto('https://www.sbs.gob.pe/app/pp/sistip_portal/paginas/publicacion/tipocambiopromedio.aspx')
    // Resize window to 1482 x 738
    await page.setViewport({ width: 1482, height: 738 })
    let exchangeRateList = []
    const dayMinus = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
    for (let index = 0; index < 15; index++) {
        if (dayMinus.length === 0) break
        const removeDay = Math.floor(Math.random() * dayMinus.length)
        const auxDay = new Date()
        await page.waitForTimeout(Math.random() * 10000)
        exchangeRateList.push(await getExchangeRateByDay(page, getDateMinusNDay(auxDay, dayMinus[removeDay])))
        dayMinus.splice(removeDay, 1)
    }

    await browser.close()
    exchangeRateList = exchangeRateList.sort((a, b) => {
        const splitDateA = a.date.split('/')
        const splitDateB = b.date.split('/')
        const dateOne = new Date(`${splitDateA[1]}-${splitDateA[0]}-${splitDateA[2]}`)
        const dateTwo = new Date(`${splitDateB[1]}-${splitDateB[0]}-${splitDateB[2]}`)
        return dateOne.getTime() - dateTwo.getTime()
    })
    const auxExchangeRate = {
        USD: { compra: '', venta: '' },
        CAD: { compra: '', venta: '' },
        CLP: { compra: '', venta: '' },
        GBP: { compra: '', venta: '' },
        JPY: { compra: '', venta: '' },
        MXN: { compra: '', venta: '' },
        CHF: { compra: '', venta: '' },
        EUR: { compra: '', venta: '' }
    }
    exchangeRateList = exchangeRateList.map((exchangeRate) => {
        Object.keys(auxExchangeRate).forEach((currency) => {
            if (!exchangeRate[currency]) {
                exchangeRate[currency] = { ...auxExchangeRate[currency] }
            } else {
                if (!exchangeRate[currency].compra) {
                    exchangeRate[currency].compra = auxExchangeRate[currency].compra
                } else {
                    auxExchangeRate[currency].compra = exchangeRate[currency].compra
                }

                if (!exchangeRate[currency].venta) {
                    exchangeRate[currency].venta = auxExchangeRate[currency].venta
                } else {
                    auxExchangeRate[currency].venta = exchangeRate[currency].venta
                }
            }
        })
        return exchangeRate
    })

    exchangeRateList.forEach((exchangeRate) => {
        const date = exchangeRate.date
        const currencies = Object.keys(exchangeRate)
        console.debug(exchangeRate)
        currencies.forEach((currency) => {
            if (currency === 'date') return
            if (Number(exchangeRate[currency].venta)) {
                dataRequest.rates[currency].push({
                    date,
                    from: currency,
                    to: 'PEN',
                    type: 1,
                    value: exchangeRate[currency].venta
                })
                dataRequest.rates[currency].push({
                    date,
                    from: 'PEN',
                    to: currency,
                    type: 1,
                    value: 1 / exchangeRate[currency].venta
                })
            }
            if (Number(exchangeRate[currency].compra)) {
                dataRequest.rates[currency].push({
                    date,
                    from: currency,
                    to: 'PEN',
                    type: 2,
                    value: exchangeRate[currency].compra
                })
                dataRequest.rates[currency].push({
                    date,
                    from: 'PEN',
                    to: currency,
                    type: 2,
                    value: 1 / exchangeRate[currency].compra
                })
            }
        })
    })
    return dataRequest
}
/**
 *
 * @param {puppeteer.Page} page
 * @param {Date} date
 * @returns
 */
async function getExchangeRateByDay(page, date) {
    const counterError = 1
    try {
        const datestring = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
        await page.type('#ctl00_cphContent_rdpDate_dateInput', datestring, { delay: 1000 + Math.random() * 2000 })
        await page.waitForTimeout(5000)
        await page.click('#ctl00_cphContent_btnConsultar', { offset: { x: Math.random() * 40, y: Math.random() * 10 } })
        await page.waitForNetworkIdle()
        const dateUpdate = await page.$('#ctl00_cphContent_updConsulta')

        const isValidOperation = await page.evaluate(
            (dateUpdate, datestring) => {
                return dateUpdate?.textContent.includes(datestring) ?? false
            },
            dateUpdate,
            datestring
        )
        if (!isValidOperation) throw Error('No se pudo recuperar datos del dia: ' + datestring)

        const bodyHandle = await page.$('#ctl00_cphContent_rgTipoCambio_ctl00 tbody')
        const exchangerates = await page.evaluate(
            (table, fecha) => {
                const exchangeratesObj = {
                    date: fecha
                }
                const isos = table.querySelectorAll('.APLI_fila3')
                isos.forEach((iso) => {
                    switch (iso.textContent) {
                        case 'Dólar de N.A.':
                            exchangeratesObj.USD = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Dólar Australiano':
                            break
                        case 'Dólar Canadiense':
                            exchangeratesObj.CAD = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Peso Chileno':
                            exchangeratesObj.CLP = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Libra Esterlina':
                            exchangeratesObj.GBP = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Peso Mexicano':
                            exchangeratesObj.MXN = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Franco Suizo':
                            exchangeratesObj.CHF = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Euro':
                            exchangeratesObj.EUR = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                        case 'Yen Japonés':
                            exchangeratesObj.JPY = {
                                name: iso.textContent,
                                compra: iso.nextElementSibling.textContent,
                                venta: iso.nextElementSibling.nextElementSibling.textContent
                            }
                            break
                    }
                })
                return exchangeratesObj
            },
            bodyHandle,
            datestring
        )
        return exchangerates
    } catch (error) {
        console.error(error)
        // await page.waitForTimeout(60 * 1000 * counterError + Math.random() * 10000)
        await page.waitForTimeout(Math.random() * 10000)

        await page.goto('https://www.sbs.gob.pe/app/pp/sistip_portal/paginas/publicacion/tipocambiopromedio.aspx')
        await page.waitForTimeout(Math.random() * 10000)

        return await getExchangeRateByDay(page, date)
    }
}
function getDateMinusNDay(nuevaFecha, numberDays) {
    nuevaFecha.setDate(nuevaFecha.getDate() - numberDays)
    return nuevaFecha
}

getSBSExchangeRates()
    .then((results) => {
        Object.values(results.rates).forEach((rate) => console.log(rate))
    })
    .catch((err) => console.error(err))
