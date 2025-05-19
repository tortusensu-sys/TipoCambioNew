const puppeteer = require('puppeteer')
const BROWLESS = '71cc86da-0e1b-403d-9d8d-9e6050d9bf34'

async function start(monthYear) {
    console.log('A new day has begun in LatamReady!')

    let errorCount = 0

    const dataSBS = {
        USD: [],
        CAD: [],
        CLP: [],
        GBP: [],
        JPY: [],
        MXN: [],
        CHF: [],
        EUR: []
    }

    let dayValidate = []

    const date = new Date()

    if (date.getMonth() == 0) {
        var lastDayPreviousMonth = new Date(new Date().getFullYear() - 1, new Date().getMonth() + 12, 0).getDate()
        var previousMonth = date.getMonth() + 12
        var year = date.getFullYear() - 1
    } else {
        var lastDayPreviousMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()
        var previousMonth = date.getMonth()
        var year = date.getFullYear()
    }

    if (monthYear == null || monthYear == '') {
        var sizeData = date.getDate()
    } else {
        var lastDayMonth = new Date(monthYear.year, monthYear.month, 0).getDate()
        var sizeData = lastDayMonth

        if (monthYear.month == 1) {
            var lastDayPreviousMonth2 = new Date(monthYear.year, monthYear.month + 11, 0).getDate()
            var previousMonth2 = monthYear.month + 11
            var year2 = monthYear.year - 1
        } else {
            var lastDayPreviousMonth2 = new Date(monthYear.year, monthYear.month - 1, 0).getDate()
            var previousMonth2 = monthYear.month - 1
            var year2 = monthYear.year
        }
    }

    async function run(headless) {
        const emptyCurrencies = []

        let browser = null

        if (!headless) {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--ignore-certificate-errors',
                    '--enable-features=NetworkService',
                    '--disable-dev-shm-usage'
                ]
            })
        } else {
            browser = await puppeteer.connect({
                browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWLESS}&timeout=7200000`
            })
        }

        const page = await browser.newPage()

        await page.setDefaultNavigationTimeout(0)
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36'
        )

        try {
            await page.goto('https://www.sbs.gob.pe/app/pp/sistip_portal/paginas/publicacion/tipocambiopromedio.aspx', {
                waitUntil: 'networkidle2'
            })

            // screen
            // await saveScreenshot(
            //     page,
            //     'https://tstdrv1930452.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=692&deploy=1&compid=TSTDRV1930452&h=42860c3b2ce293fa7084',
            //     'BUNDLES-TEST '+ new Date().toISOString(),
            //     'esto es para ver la pagina si ta vacia',
            //     '82823'
            // );

            await page.bringToFront()
            await page.waitForTimeout(2000)

            for (var i = 0; i <= sizeData; i++) {
                if (i == sizeData) {
                    await page.waitForTimeout(3000)

                    if (monthYear == null || monthYear == '') {
                        await page.type(
                            '#ctl00_cphContent_rdpDate_dateInput',
                            lastDayPreviousMonth + '/' + previousMonth + '/' + year
                        )
                    } else {
                        await page.type(
                            '#ctl00_cphContent_rdpDate_dateInput',
                            lastDayPreviousMonth2 + '/' + previousMonth2 + '/' + year2
                        )
                    }
                } else {
                    await page.waitForTimeout(3000)

                    if (monthYear == null || monthYear == '') {
                        await page.type(
                            '#ctl00_cphContent_rdpDate_dateInput',
                            date.getDate() - i + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                        )
                    } else {
                        await page.type(
                            '#ctl00_cphContent_rdpDate_dateInput',
                            lastDayMonth - i + '/' + monthYear.month + '/' + monthYear.year
                        )
                    }
                }

                //   throw "Error Test";

                dayValidate = await page.evaluate(
                    (monthYear, lastDayMonth, sizeData, i) => {
                        const months = [
                            { 0: 'enero' },
                            { 1: 'febrero' },
                            { 2: 'marzo' },
                            { 3: 'abril' },
                            { 4: 'mayo' },
                            { 5: 'junio' },
                            { 6: 'julio' },
                            { 7: 'agosto' },
                            { 8: 'septiembre' },
                            { 9: 'octubre' },
                            { 10: 'noviembre' },
                            { 11: 'diciembre' }
                        ]

                        const date = new Date()

                        const monthSBS = document.querySelector('#ctl00_cphContent_rdpDate_calendar_Title').textContent
                        let isMonthActual = false

                        if (monthYear == null || monthYear == '') {
                            var dateMonth = date.getMonth()
                        } else var dateMonth = Number(monthYear.month) - 1

                        months.forEach((line, index) => {
                            if (dateMonth == Object.keys(line)[0]) {
                                if (monthSBS.toLowerCase().includes(line[index])) {
                                    isMonthActual = true
                                } else isMonthActual = false
                            }
                        })

                        const daySelect = document
                            .querySelector('#ctl00_cphContent_rdpDate_calendar_Top tbody')
                            .getElementsByTagName('a')
                        const dayNoSelect = document
                            .querySelector('#ctl00_cphContent_rdpDate_calendar_Top tbody')
                            .getElementsByTagName('span')

                        const getDaySelect = []
                        let indexSelect = 0
                        const getDayNoSelect = []
                        let indexNoSelect = 0

                        let result = []

                        for (var j = 0; j < daySelect.length; j++) {
                            getDaySelect.push(daySelect[j].innerHTML)
                        }
                        for (var j = 0; j < dayNoSelect.length; j++) {
                            getDayNoSelect.push(dayNoSelect[j].innerHTML)
                        }

                        indexSelect = getDaySelect.findIndex((element) => element == '1')

                        if (monthYear == null || monthYear == '') {
                            indexNoSelect = getDayNoSelect.findIndex((element) => element == date.getDate().toString())
                        } else {
                            if (monthYear.month == date.getMonth() + 1 && monthYear.year == date.getFullYear()) {
                                indexNoSelect = getDayNoSelect.findIndex(
                                    (element) => element == lastDayMonth.toString()
                                )
                            }
                        }

                        for (var j = 0; j < getDaySelect.length; j++) {
                            if (j < indexSelect) continue
                            else result.push(getDaySelect[j])
                        }

                        for (var j = 0; j < getDayNoSelect.length; j++) {
                            if (j <= indexNoSelect) result.push('')
                        }

                        if (i != sizeData && !isMonthActual) {
                            if (
                                monthYear == null ||
                                monthYear == '' ||
                                (monthYear.month - 1 == date.getMonth() && monthYear.year == date.getFullYear())
                            ) {
                                result = []

                                for (var j = 0; j < sizeData; j++) {
                                    result.push('')
                                }
                            }
                        }

                        return result.reverse()
                    },
                    monthYear,
                    lastDayMonth,
                    sizeData,
                    i
                )

                if (dayValidate[i] == '') {
                    await page.click('.APLI_txtFecha')
                    continue
                }

                await page.click('.APLI_txtFecha')

                if (i != sizeData) await page.click('#ctl00_cphContent_btnConsultar')

                if (i == sizeData) {
                    if (monthYear == null || monthYear == '') {
                        var auxDay = lastDayPreviousMonth
                        var auxMonth = previousMonth
                        var auxYear = year
                    } else {
                        var auxDay = lastDayPreviousMonth2
                        var auxMonth = previousMonth2
                        var auxYear = year2
                    }

                    loop: for (var j = 0; j < auxDay; j++) {
                        await page.type(
                            '#ctl00_cphContent_rdpDate_dateInput',
                            auxDay - j + '/' + auxMonth + '/' + auxYear
                        )
                        await page.click('.APLI_txtFecha')

                        const inputError = await page.evaluate(() => {
                            if (
                                document.querySelector('#ctl00_cphContent_rdpDate_dateInput').className ==
                                'riTextBox riError'
                            ) {
                                return true
                            }
                        })

                        if (inputError == true) {
                            await page.waitForTimeout(2000)
                            continue
                        }

                        await page.click('#ctl00_cphContent_btnConsultar')
                        await page.waitForTimeout(3000)

                        const noRecord = await page.evaluate(() => {
                            if (document.querySelector('#ctl00_cphContent_rgTipoCambio_ctl00__0') == undefined) {
                                return 0
                            } else return 1
                        })

                        if (noRecord == 0) continue loop
                        else break loop
                    }
                }

                // Espera a que se lanze un atributo especificado y su valor correspondiente (si es necesario) para ejecutar el siguiente paso
                await page.waitForSelector('#ctl00_cphContent_rgTipoCambio_ctl00')

                await page.waitForTimeout(3000)

                dataSBS.USD[i] = await setDataSBS(page, 'USD')
                dataSBS.CAD[i] = await setDataSBS(page, 'CAD')
                dataSBS.CLP[i] = await setDataSBS(page, 'CLP')
                dataSBS.GBP[i] = await setDataSBS(page, 'GBP')
                dataSBS.JPY[i] = await setDataSBS(page, 'JPY')
                dataSBS.MXN[i] = await setDataSBS(page, 'MXN')
                dataSBS.CHF[i] = await setDataSBS(page, 'CHF')
                dataSBS.EUR[i] = await setDataSBS(page, 'EUR')
            }

            async function setDataSBS(page, currency) {
                return await page.evaluate((currency) => {
                    const select = document.querySelector('#ctl00_cphContent_rgTipoCambio_ctl00__0')
                    const fecha = document.getElementById('ctl00_cphContent_rdpDate_dateInput').value

                    const day = fecha.substr(0, 2)
                    const month = fecha.substr(3, 2)
                    const year = fecha.substr(6, 4)

                    const dateActual = new Date()
                    if (day != dateActual.getDate() - 1) return []
                    const firstDay = new Date(new Date().getFullYear(), new Date().getMonth() + 12, 1).getDate()
                    const firstDay2 = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDate()
                    const lastDay2 = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()

                    let nextMonth = Number(month) + 1
                    const nextYear = Number(year) + 1

                    let fechSunat = Number(day) + 1 + '/' + month + '/' + year

                    if (Number(day) > 0 && Number(day) < 9) {
                        fechSunat = '0' + (Number(day) + 1).toString() + '/' + month + '/' + year
                    }

                    if (Number(month) == dateActual.getMonth() + 12) {
                        if (year == dateActual.getFullYear() - 1) nextMonth = Number(month)

                        if ((Number(month) > 0 && Number(month) < 10) || (Number(month) == 12 && Number(day) == 31)) {
                            fechSunat = firstDay + '/0' + nextMonth.toString() + '/' + nextYear

                            if (Number(firstDay) > 0 && Number(firstDay) < 10) {
                                fechSunat = '0' + firstDay.toString() + '/0' + nextMonth.toString() + '/' + nextYear
                            }
                        } else {
                            fechSunat = firstDay + '/' + nextMonth + '/' + nextYear

                            if (Number(firstDay) > 0 && Number(firstDay) < 10) {
                                fechSunat = '0' + firstDay.toString() + '/' + nextMonth + '/' + nextYear
                            }
                        }
                    } else if (Number(month) == dateActual.getMonth() && Number(day) == lastDay2) {
                        if (Number(month) > 0 && Number(month) < 10) {
                            fechSunat = firstDay2 + '/0' + nextMonth.toString() + '/' + year

                            if (Number(firstDay2) > 0 && Number(firstDay2) < 10) {
                                fechSunat = '0' + firstDay2.toString() + '/0' + nextMonth.toString() + '/' + year
                            }
                        } else {
                            fechSunat = firstDay2 + '/' + nextMonth + '/' + year

                            if (Number(firstDay2) > 0 && Number(firstDay2) < 10) {
                                fechSunat = '0' + firstDay2.toString() + '/' + nextMonth + '/' + year
                            }
                        }
                    }

                    if (select != null) {
                        var dataByIsos = []

                        const table = document.querySelector('#ctl00_cphContent_rgTipoCambio_ctl00 tbody')
                        const isos = table.querySelectorAll('.APLI_fila3')

                        isos.forEach((line) => {
                            if (
                                (line.innerHTML.substring(9, 12) == 'N.A' && currency == 'USD') ||
                                (line.innerHTML.substring(6, 9) == 'Can' && currency == 'CAD') ||
                                (line.innerHTML.substring(5, 8) == 'Chi' && currency == 'CLP') ||
                                (line.innerHTML.substring(0, 3) == 'Lib' && currency == 'GBP') ||
                                (line.innerHTML.substring(0, 3) == 'Yen' && currency == 'JPY') ||
                                (line.innerHTML.substring(5, 8) == 'Mex' && currency == 'MXN') ||
                                (line.innerHTML.substring(7, 10) == 'Sui' && currency == 'CHF') ||
                                (line.innerHTML.substring(0, 3) == 'Eur' && currency == 'EUR')
                            ) {
                                const parent = document.querySelector('#' + line.parentNode.id)
                                const elements = parent.querySelectorAll('.APLI_fila2')

                                dataByIsos = [
                                    {
                                        fecPublica: fechSunat,
                                        valTipo:
                                            elements[1].innerHTML == '&nbsp;'
                                                ? elements[0].innerHTML
                                                : elements[1].innerHTML,
                                        codTipo: 'V'
                                    },
                                    {
                                        fecPublica: fechSunat,
                                        valTipo:
                                            elements[0].innerHTML == '&nbsp;'
                                                ? elements[1].innerHTML
                                                : elements[0].innerHTML,
                                        codTipo: 'C'
                                    }
                                ]
                            }
                        })
                    } else {
                        var dataByIsos = [
                            {
                                fecPublica: fechSunat,
                                valTipo: '',
                                codTipo: 'V'
                            },
                            {
                                fecPublica: fechSunat,
                                valTipo: '',
                                codTipo: 'C'
                            }
                        ]
                    }

                    return dataByIsos
                }, currency)
            }

            function formatDataSBS(dataSBS, currency) {
                if (dataSBS.flat().length > 0) {
                    dataSBS = dataSBS.flat()
                    qtyData = dataSBS.length

                    if (
                        qtyData > 2 &&
                        dataSBS[qtyData - 1].fecPublica.substr(3, 2) != dataSBS[qtyData - 3].fecPublica.substr(3, 2)
                    ) {
                        dataSBS[qtyData - 1].fecPublica =
                            '0' +
                            (Number(dataSBS[qtyData - 3].fecPublica.substr(0, 2)) - 1) +
                            '/' +
                            dataSBS[qtyData - 3].fecPublica.substr(3, 2) +
                            '/' +
                            dataSBS[qtyData - 3].fecPublica.substr(6, 4)
                    }

                    if (monthYear == null || monthYear == '') {
                        var dateInit = {
                            month: Number(date.getMonth()) + 1,
                            year: date.getFullYear()
                        }
                    } else var dateInit = monthYear

                    if (
                        (qtyData > 2 &&
                            dataSBS[qtyData - 1].fecPublica.substr(3, 2) !=
                                dataSBS[qtyData - 3].fecPublica.substr(3, 2)) ||
                        (qtyData <= 2 && Number(dataSBS[qtyData - 1].fecPublica.substr(3, 2)) != dateInit.month)
                    ) {
                        if (dateInit.month > 9) {
                            dataSBS[qtyData - 1].fecPublica = '01/' + dateInit.month + '/' + dateInit.year
                        } else {
                            dataSBS[qtyData - 1].fecPublica = '01/0' + dateInit.month + '/' + dateInit.year
                        }
                    }

                    dataSBS[qtyData - 2].fecPublica = dataSBS[qtyData - 1].fecPublica

                    loop1: for (var i = 0; i < qtyData; i++) {
                        if (i % 2 == 0) {
                            if (dataSBS[i].valTipo == '') {
                                loop2: for (let j = 2; j < qtyData; j++) {
                                    if (j % 2 == 0 && dataSBS[i + j] != undefined) {
                                        if (dataSBS[i + j].valTipo == '') {
                                            continue loop2
                                        } else {
                                            dataSBS[i].valTipo = dataSBS[i + j].valTipo
                                            dataSBS[i + 1].valTipo = dataSBS[i + j + 1].valTipo

                                            continue loop1
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (
                        (currency == 'USD' || currency == 'GBP' || currency == 'CHF' || currency == 'EUR') &&
                        date.getDate() * 2 > qtyData &&
                        (monthYear == null ||
                            monthYear == '' ||
                            (monthYear.month == Number(date.getMonth()) + 1 &&
                                monthYear.year == Number(date.getFullYear())))
                    ) {
                        for (var i = 0; i <= date.getDate() * 2 - qtyData; i++) {
                            if (i % 2 == 0) {
                                if (Number(dataSBS.flat()[0].fecPublica.substr(0, 2)) + 1 < 10) {
                                    if (Number(dataSBS.flat()[0].fecPublica.substr(3, 2)) + 1 < 10) {
                                        dataSBS.unshift([
                                            {
                                                fecPublica:
                                                    '0' +
                                                    (i / 2 + 1 + Number(dataSBS.flat()[i].fecPublica.substr(0, 2))) +
                                                    '/0' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[0].valTipo,
                                                codTipo: 'V'
                                            },
                                            {
                                                fecPublica:
                                                    '0' +
                                                    (i / 2 + 1 + Number(dataSBS.flat()[i].fecPublica.substr(0, 2))) +
                                                    '/0' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[1].valTipo,
                                                codTipo: 'C'
                                            }
                                        ])
                                    } else {
                                        dataSBS.unshift([
                                            {
                                                fecPublica:
                                                    '0' +
                                                    (i / 2 + 1 + Number(dataSBS.flat()[i].fecPublica.substr(0, 2))) +
                                                    '/' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[0].valTipo,
                                                codTipo: 'V'
                                            },
                                            {
                                                fecPublica:
                                                    '0' +
                                                    (i / 2 + 1 + Number(dataSBS.flat()[i].fecPublica.substr(0, 2))) +
                                                    '/' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[1].valTipo,
                                                codTipo: 'C'
                                            }
                                        ])
                                    }
                                } else {
                                    if (Number(dataSBS.flat()[0].fecPublica.substr(3, 2)) + 1 < 10) {
                                        dataSBS.unshift([
                                            {
                                                fecPublica:
                                                    i / 2 +
                                                    1 +
                                                    Number(dataSBS.flat()[i + 1].fecPublica.substr(0, 2)) +
                                                    '/0' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[0].valTipo,
                                                codTipo: 'V'
                                            },
                                            {
                                                fecPublica:
                                                    i / 2 +
                                                    1 +
                                                    Number(dataSBS.flat()[i + 1].fecPublica.substr(0, 2)) +
                                                    '/0' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[1].valTipo,
                                                codTipo: 'C'
                                            }
                                        ])
                                    } else {
                                        dataSBS.unshift([
                                            {
                                                fecPublica:
                                                    i / 2 +
                                                    1 +
                                                    Number(dataSBS.flat()[i + 1].fecPublica.substr(0, 2)) +
                                                    '/' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[0].valTipo,
                                                codTipo: 'V'
                                            },
                                            {
                                                fecPublica:
                                                    i / 2 +
                                                    1 +
                                                    Number(dataSBS.flat()[i + 1].fecPublica.substr(0, 2)) +
                                                    '/' +
                                                    (date.getMonth() + 1) +
                                                    '/' +
                                                    date.getFullYear(),

                                                valTipo: dataSBS.flat()[1].valTipo,
                                                codTipo: 'C'
                                            }
                                        ])
                                    }
                                }
                            }
                        }
                    }

                    const formatDataSBS = dataSBS.flat().filter((element) => element.valTipo !== '')

                    return formatDataSBS
                } else return []
            }

            function setCurrencies(line, dataRequest, currency) {
                if (line.codTipo == 'V') var typeChange = 1
                else var typeChange = 2

                dataRequest.rates[currency].push({
                    date: line.fecPublica,
                    from: currency,
                    to: 'PEN',
                    type: typeChange,
                    value: line.valTipo
                })

                dataRequest.rates[currency].push({
                    date: line.fecPublica,
                    from: 'PEN',
                    to: currency,
                    type: typeChange,
                    value: 1 / line.valTipo
                })

                dataRequest.rates[currency].sort(function (a, b) {
                    if (a.date < b.date) return -1
                    if (a.date > b.date) return 1
                    if (a.type < b.type) return -1
                    if (a.type > b.type) return 1

                    return 0
                })
            }

            function verifyCurrencies(line, currency) {
                if (!line.value) {
                    emptyCurrencies.push({
                        date: line.date,
                        type: line.type == 1 ? 'Venta' : 'Compra',
                        currency
                    })
                }

                return emptyCurrencies
            }

            dataSBS.USD = formatDataSBS(dataSBS.USD, 'USD')
            dataSBS.CAD = formatDataSBS(dataSBS.CAD, 'CAD')
            dataSBS.CLP = formatDataSBS(dataSBS.CLP, 'CLP')
            dataSBS.GBP = formatDataSBS(dataSBS.GBP, 'GBP')
            dataSBS.JPY = formatDataSBS(dataSBS.JPY, 'JPY')
            dataSBS.MXN = formatDataSBS(dataSBS.MXN, 'MXN')
            dataSBS.CHF = formatDataSBS(dataSBS.CHF, 'CHF')
            dataSBS.EUR = formatDataSBS(dataSBS.EUR, 'EUR')

            console.log('response', dataSBS.USD.flat().reverse())

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

            dataSBS.USD.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'USD')
                })
            dataSBS.CAD.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'CAD')
                })
            dataSBS.CLP.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'CLP')
                })
            dataSBS.GBP.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'GBP')
                })
            dataSBS.JPY.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'JPY')
                })
            dataSBS.MXN.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'MXN')
                })
            dataSBS.CHF.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'CHF')
                })
            dataSBS.EUR.flat()
                .reverse()
                .forEach((line) => {
                    setCurrencies(line, dataRequest, 'EUR')
                })

            dataRequest.rates.USD.forEach((line) => {
                verifyCurrencies(line, 'USD')
            })
            dataRequest.rates.CAD.forEach((line) => {
                verifyCurrencies(line, 'CAD')
            })
            dataRequest.rates.CLP.forEach((line) => {
                verifyCurrencies(line, 'CLP')
            })
            dataRequest.rates.GBP.forEach((line) => {
                verifyCurrencies(line, 'GBP')
            })
            dataRequest.rates.JPY.forEach((line) => {
                verifyCurrencies(line, 'JPY')
            })
            dataRequest.rates.MXN.forEach((line) => {
                verifyCurrencies(line, 'MXN')
            })
            dataRequest.rates.CHF.forEach((line) => {
                verifyCurrencies(line, 'CHF')
            })
            dataRequest.rates.EUR.forEach((line) => {
                verifyCurrencies(line, 'EUR')
            })

            if (emptyCurrencies.length > 0) {
                let content = '['

                emptyCurrencies.forEach((line) => {
                    content += `<br>&nbsp;&nbsp;&nbsp;${JSON.stringify(line)}`
                })

                content += '<br>]'

                axios
                    .post(
                        'https://chat.googleapis.com/v1/spaces/AAAAv7K96R8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zVKshDUMFyZseIKxDgl1V0CVhqKIrUHFguuadStgLH8%3D',
                        {
                            cardsV2: [
                                {
                                    cardId: 'unique-card-id',
                                    card: {
                                        header: {
                                            title: 'ADVERTENCIA EN BOT SBS',
                                            subtitle: 'latamready@latamready.com',
                                            imageUrl: 'https://i.ibb.co/TgF88kY/descarga.png',
                                            imageType: 'CIRCLE'
                                        },
                                        sections: [
                                            {
                                                header: 'VALORES VACÍOS ENCONTRADOS',
                                                widgets: [
                                                    {
                                                        textParagraph: {
                                                            text: content
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    )
                    .then(function (response) {
                        // console.log(response);
                    })
                    .catch(function (error) {
                        console.error(error.toJSON())
                    })
            }

            // console.log('data STLT: ', dataRequest.rates.USD);

            async function sendDataSuitelet(currencyTo) {
                return await saveData(
                    config.MANAGER_URL,
                    { 'exrate-action': 'addExchangeRate' },
                    {
                        portal: dataRequest.portal,
                        rates: dataRequest.rates[currencyTo],
                        currencyFrom: 'PEN',
                        currencyTo
                    }
                )
                    .then((response) => {
                        return JSON.parse(response.body)
                    })
                    .catch((error) => {
                        console.error('error:', error)
                    })
            }

            if (dataRequest.rates.USD.length > 0) await sendDataSuitelet('USD')
            if (dataRequest.rates.CAD.length > 0) await sendDataSuitelet('CAD')
            if (dataRequest.rates.CLP.length > 0) await sendDataSuitelet('CLP')
            if (dataRequest.rates.GBP.length > 0) await sendDataSuitelet('GBP')
            if (dataRequest.rates.JPY.length > 0) await sendDataSuitelet('JPY')
            if (dataRequest.rates.MXN.length > 0) await sendDataSuitelet('MXN')
            if (dataRequest.rates.CHF.length > 0) await sendDataSuitelet('CHF')
            if (dataRequest.rates.EUR.length > 0) await sendDataSuitelet('EUR')

            const valCompra = []
            const valVenta = []
            const fechaUlt = []
            const fechaFin = []

            for (var i = 0; i < dataSBS.USD.flat().length; i++) {
                if (i % 2 == 0) {
                    valCompra.push(dataSBS.USD.flat().reverse()[i].valTipo)
                    valVenta.push(dataSBS.USD.flat().reverse()[i + 1].valTipo)
                    fechaUlt.push(dataSBS.USD.flat().reverse()[i].fecPublica)
                }
            }

            for (var j = 0; j < dataSBS.USD.flat().length / 2; j++) {
                fechaFin.push({
                    dia: Number(fechaUlt[j].substr(0, 2)),
                    mes: Number(fechaUlt[j].substr(3, 2)) - 1,
                    anio: Number(fechaUlt[j].substr(6, 4))
                })

                if (valCompra[j]) {
                    const keys = {
                        'lmry-action': 'saveTypeOfChange',
                        'lmry-account': config.LMRY_ACCOUNT
                    }

                    const res = []

                    res[j] = await saveData(config.WS_URL, keys, {
                        fecha: fechaFin[j],
                        compra: parseFloat(valCompra[j]),
                        venta: parseFloat(valVenta[j]),
                        currency: 2
                    }).then((response) => {
                        return JSON.parse(response.body)
                    })
                }
            }

            await sendData(1)

            const pages = await browser.pages()
            await Promise.all(pages.map((page) => page.close()))
            await browser.close()

            errorCount = 0

            return dataSBS.USD.flat().reverse()
        } catch (error) {
            if (browser) {
                const pages = await browser.pages()
                await Promise.all(pages.map((page) => page.close()))
                await browser.close()
            }

            errorCount++

            if (errorCount < 5) {
                await page.waitForTimeout(1000 * 60 * 5)

                await run(true)
            } else {
                console.log('error en bot sbs', error)
                axios
                    .post(
                        'https://chat.googleapis.com/v1/spaces/AAAAv7K96R8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zVKshDUMFyZseIKxDgl1V0CVhqKIrUHFguuadStgLH8%3D',
                        {
                            cardsV2: [
                                {
                                    cardId: 'unique-card-id',
                                    card: {
                                        header: {
                                            title: 'ERROR EN BOT SBS',
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
                                                            text: error.stack.toString()
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    )
                    .then(function (response) {
                        // console.log(response);
                    })
                    .catch(function (error) {
                        console.error(error.toJSON())
                    })

                errorCount = 0
            }
        }
    }

    try {
        return await run(true)
    } catch (error) {
        console.log(error)
    }
}
start('')
