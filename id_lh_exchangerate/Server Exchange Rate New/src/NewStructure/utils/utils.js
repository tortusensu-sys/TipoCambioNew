/* eslint-disable camelcase */

function getDateMinusOneDay(date) {
    // console.log('getDateMinusOneDay', date)
    const dateElement = date.split('-')
    const nuevaFecha = new Date(`${dateElement[1]}/${dateElement[2]}/${dateElement[0]}`)
    nuevaFecha.setDate(nuevaFecha.getDate() - 1)
    // Formatear a dd/mm/yyyy
    const dia = nuevaFecha.getDate().toString().padStart(2, '0')
    const mes = (nuevaFecha.getMonth() + 1).toString().padStart(2, '0') // Meses empiezan desde 0
    const anio = nuevaFecha.getFullYear()
    return `${dia}/${mes}/${anio}`
}

function getDateSearchCR(date) {
    const array_date = date.split('/')

    const newDate = Number(array_date[0]) + ' ' + this.getMonthShortName(this.zeroFill(Number(array_date[1]), 2)) + ' ' + array_date[2]

    return newDate
}

function getFormatDateCR(date) {
    const array_date = date.split('/')

    let dateStart = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
    const dateEnd = array_date[2] + '/' + this.zeroFill(Number(array_date[1]), 2) + '/' + this.zeroFill(Number(array_date[0]), 2)

    dateStart.setDate(dateStart.getDate() - 7)

    const day = dateStart.getDate()
    const month = dateStart.getMonth() + 1
    const year = dateStart.getFullYear()

    dateStart = year + '/' + this.zeroFill(month, 2) + '/' + this.zeroFill(day, 2)

    return {
        dateStart,
        dateEnd
    }
}

function getFormatDateBR(date) {
    const array_date = date.split('/')
    const datestart = `${array_date[1]}-${array_date[0]}-${array_date[2]}`

    return datestart
}

function getFormatDateMX(date) {
    const array_date = date.split('/')

    let newDate = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))

    newDate.setDate(newDate.getDate() - 1)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()

    newDate = year + '-' + month + '-' + day

    return newDate
}

function getFormatDateHN(date) {
    const array_date = date.split('/')
    const newDate = new Date(`${array_date[1]}/${array_date[0]}/${array_date[2]}`)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()

    return year + '-' + month + '-' + day
}

function getFormatDateMXDOF(date, days) {
    const array_date = date.split('/')

    let newDate = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))

    newDate.setDate(newDate.getDate() - days)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()

    newDate = year + '-' + month + '-' + day

    return newDate
}

function getFormatDateMXParaPagos(date, days) {
    const array_date = date.split('/')

    let newDate = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))

    newDate.setDate(newDate.getDate() - days)
    const day = newDate.getDate()
    const month = newDate.getMonth() + 1
    const year = newDate.getFullYear()

    newDate = year + '-' + month + '-' + day

    return newDate
}

function getFormatDateCO(date) {
    const array_date = date.split('/')

    let dateEnd = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
    let dateStart = new Date(dateEnd)

    dateStart.setDate(dateEnd.getDate() - 4)
    dateStart = dateStart.toISOString()
    dateEnd = dateEnd.toISOString()
    dateStart = dateStart.substring(0, 11) + '00:00'
    dateEnd = dateEnd.substring(0, 11) + '00:00'

    return {
        from: dateStart,
        to: dateEnd
    }
}

function getFormatDateCo_Ad(date) {
    const array_date = date.split('/')
    let dateFormat = new Date(Number(array_date[2]), Number(array_date[1]) - 1, Number(array_date[0]))
    dateFormat = `${dateFormat.getDate()}-${this.getMonthByNumber(dateFormat.getMonth())}-${dateFormat.getFullYear()}`

    return dateFormat
}

function getMonthByNumber(number) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic']

    return months[number]
}

function filterById(arr, text) {
    let id = -1

    arr.forEach((line, index) => {
        if (line.indexOf(text) > -1) id = index
    })

    return id
}

function zeroFill(number, width) {
    width -= number.toString().length

    if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number

    return number + ''
}

function getMonthShortName(number) {
    switch (number) {
        case '01':
            return 'Ene'
        case '02':
            return 'Feb'
        case '03':
            return 'Mar'
        case '04':
            return 'Abr'
        case '05':
            return 'May'
        case '06':
            return 'Jun'
        case '07':
            return 'Jul'
        case '08':
            return 'Ago'
        case '09':
            return 'Set'
        case '10':
            return 'Oct'
        case '11':
            return 'Nov'
        case '12':
            return 'Dic'
        default:
            break
    }

    return ''
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

function getDateCRUSD(date) {
    date = date.split('/')
    return `${date[2]}-${date[1]}-${date[0]}T00:00:00.000Z`
}

function lastDayMonth(month, year) {
    const lastDay = new Date(Number(year), Number(month) - 1, 0).getDate()
    return lastDay
}

function getDayFormant(dateElemnet) {
    const particionDate = dateElemnet.split('-')
    const dayNewoldString = dateElemnet.slice(8, 10)
    const dayNewold = Number(dayNewoldString)
    console.log('dayNewoldString', dayNewoldString)
    if (dayNewold === 1) {
        const lastDayDate = lastDayMonth(particionDate[1], particionDate[0])
        particionDate[2] = particionDate[2].replace(dayNewoldString, lastDayDate)
        const monthNew = (Number(particionDate[1]) - 1).toString().padStart(2, '0')
        particionDate[1] = particionDate[1].replace(particionDate[1], monthNew)
    } else {
        console.log('dayNewold', dayNewold)
        const dayNew = (dayNewold - 1).toString().padStart(2, '0')
        console.log('dayNew', dayNew)
        particionDate[2] = particionDate[2].replace(dayNewoldString, dayNew)
    }
    return particionDate.join('-')
}

module.exports = {
    getMonthFullName,
    getDateMinusOneDay,
    getDateSearchCR,
    getFormatDateCR,
    getFormatDateBR,
    getFormatDateMX,
    getFormatDateHN,
    getFormatDateMXDOF,
    getFormatDateMXParaPagos,
    getFormatDateCO,
    getFormatDateCo_Ad,
    filterById,
    zeroFill,
    getMonthShortName,
    getMonthByNumber,
    getDateCRUSD,
    getDayFormant
}
