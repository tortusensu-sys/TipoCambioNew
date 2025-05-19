/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
const axios = require('axios')
const cheerio = require('cheerio')
function zeroFill(number, width) {
    width -= number.toString().length

    if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number

    return number + ''
}
function getMonthFullName(number) {
    let month = ''

    switch (number) {
        case '01':
            month = 'Enero'
            break
        case '02':
            month = 'Febrero'
            break
        case '03':
            month = 'Marzo'
            break
        case '04':
            month = 'Abril'
            break
        case '05':
            month = 'Mayo'
            break
        case '06':
            month = 'Junio'
            break
        case '07':
            month = 'Julio'
            break
        case '08':
            month = 'Agosto'
            break
        case '09':
            month = 'Septiembre'
            break
        case '10':
            month = 'Octubre'
            break
        case '11':
            month = 'Noviembre'
            break
        case '12':
            month = 'Diciembre'
            break
    }

    return '_' + month
}
async function getExchangeRate_Chile(date) {
    let resultContext = []
    let value = ''
    let idDate = ''
    let flag = false

    const array_date = date.split('/')

    if (array_date[0] != '31') {
        const dateInitial = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
        dateInitial.setDate(dateInitial.getDate() + 1)
        var day = zeroFill(dateInitial.getDate(), 2)
        var month = zeroFill(dateInitial.getMonth() + 1, 2)

        if (array_date[0] == '30' && ['04', '06', '09', '11'].indexOf(array_date[1]) !== -1) {
            day = '31'
            month = array_date[1]
        } else if (array_date[1] == '02') {
            if (array_date[0] == '28' && array_date[2] % 4 != 0) {
                day = '29'
                month = array_date[1]
            } else if (array_date[0] == '29' && array_date[2] % 4 == 0) {
                day = '30'
                month = array_date[1]
            }
        }
    } else {
        var day = '32'
        var month = array_date[1]
    }

    idDate = 'gr_ctl' + day + '' + getMonthFullName(month)

    const urlHttp =
        'https://si3.bcentral.cl/IndicadoresSiete/secure/Serie.aspx?gcode=PRE_TCO&param=RABmAFYAWQB3AGYAaQBuAEkALQAzADUAbgBNAGgAaAAkADUAVwBQAC4AbQBYADAARwBOAGUAYwBjACMAQQBaAHAARgBhAGcAUABTAGUAdwA1ADQAMQA0AE0AawBLAF8AdQBDACQASABzAG0AXwA2AHQAawBvAFcAZwBKAEwAegBzAF8AbgBMAHIAYgBDAC4ARQA3AFUAVwB4AFIAWQBhAEEAOABkAHkAZwAxAEEARAA%3d'
    const headerObj = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    const responseGet = await axios.get(urlHttp, headerObj)
    const html = responseGet.data

    const $ = cheerio.load(html)

    const viewStateValue = $('input[name="__VIEWSTATE"]').val()
    const eventValidationValue = $('input[name="__EVENTVALIDATION"]').val()

    const bodyObj = JSON.stringify({
        _EVENTTARGET: 'DrDwnFechas',
        __EVENTARGUMENT: '',
        __LASTFOCUS: '',
        __VIEWSTATE: viewStateValue,
        __VIEWSTATEGENERATOR: '1F2BBC68',
        __EVENTVALIDATION: eventValidationValue,
        DrDwnFechas: array_date[2],
        hdnFrecuencia: 'DAILY'
    })
    const response = await axios.post(urlHttp, bodyObj, headerObj)

    const objars = response.data
    // console.log(response.data)

    if (objars.indexOf(idDate) != -1) {
        const template = objars.split('contenedor_serie')[1]

        let condition = false
        let cont = 1

        while (!condition) {
            if (template.indexOf(idDate) != -1) {
                value = template.split(idDate)[1].split('</span>')[0].split('class="obs">')[1]

                if (value.length > 0) {
                    value = value.replace(',', '.')
                    condition = true
                } else {
                    const datestart = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))

                    if (day != '32') datestart.setDate(datestart.getDate() + 1 - cont)

                    var day = zeroFill(datestart.getDate(), 2)
                    var month = zeroFill(datestart.getMonth() + 1, 2)
                    var year = datestart.getFullYear()

                    idDate = 'gr_ctl' + day + '' + getMonthFullName(month)
                    cont++
                }
            } else condition = true
        }
        // console.log(idDate, !value)
        if (idDate == 'gr_ctl01_Enero' || (value !== 0 && !value)) {
            let newDate = new Date(Number(year), Number(month) - 1, Number(day))
            newDate.setDate(newDate.getDate() - 1)
            const newday = zeroFill(newDate.getDate(), 2)
            const newmonth = zeroFill(newDate.getMonth() + 1, 2)
            const newyear = newDate.getFullYear()
            newDate = newday + '/' + newmonth + '/' + newyear

            resultContext = await getExchangeRate_Chile(newDate)
            flag = true
        }
    }

    if (!flag) {
        resultContext.push({
            compra: parseFloat(value),
            venta: parseFloat(value),
            nomenclatura: 'CLP'
        })
    }

    return resultContext
}
;(async () => {
    console.log(await getExchangeRate_Chile('02/02/2025'))
})()
