/* eslint-disable no-unused-vars */
const config = require('../config.js')
const { doRequest } = require('../connections/connection.js')

const URL_EXCHANGE = config.EXCHANGE_RATES_URL
const URL_MANAGER = config.MANAGER_URL

// obtiene el exchange de netsuite por un resletlet
async function getDataFromService(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'lmry-action': 'getExchangeRate_v3',
      'lmry-account': 'TSTDRV1930452'
    }
    return await doRequest(URL_EXCHANGE, data, 'POST', headers)
  } catch (e) {
    console.log('error en la conexion getDataFromService: ', e)
  }
}

// obtiene un exchange por medio del suitlet
async function getDataFromSuitelet(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'exrate-action': 'getAccWithCurrencies'
    }

    return await doRequest(URL_MANAGER, data, 'POST', headers)
  } catch (e) {
    console.log('error en la conexion getDataFromSuitelet: ', e)
  }
}

// guarda los tipos de cambio en el ambiente llc
async function saveData(data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      'exrate-action': 'addExchangeRate'
    }
    console.log('URL_MANAGER', URL_MANAGER)
    console.log('data', data)
    return await doRequest(URL_MANAGER, data, 'POST', headers)
  } catch (e) {
    console.log('error en la conexion saveData: ', e)
  }
}

async function sendDataRestlet(external, authenticate, data) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0',
      Authorization: authenticate
    }

    return await doRequest(external, data, 'POST', headers)
  } catch (e) {
    console.log('error en la conexion sendDataRestlet: ', e)
  }
}

async function sendData(portal) {
  try {
    let accData = {}
    let body = null
    let serverResponse = null

    await getDataFromSuitelet({
        portal
    }).then(response => {
        accData = JSON.parse(response.body).data
    }).catch((error) => {
        console.error('Error en la petición sendData', error)
        serverResponse = error
    })

    // console.log('accData', accData.currencies);

    accData.users.forEach(async(line, index) => {
        body = {
            content: accData.currencies,
            'hub-app-action': 'history:add',
            Authorization: line.token
        }

        await sendDataRestlet(
            line.external,
            line.authenticate,
            body
        ).then(response => {
            console.log(response.body)
            serverResponse = response.body
        }).catch((error) => {
            console.error('Error en RESTLET sendData', error)
            serverResponse = error
        })
    })

    // setTimeout(() => console.log('Response', serverResponse), 10 * 1000);

    // setTimeout(() => { return res.send(serverResponse) }, 10 * 1000);
  } catch (e) {
    console.log('error al enviar al restlet sendData: ', e)
  }
}

module.exports = {
  getDataFromService,
  getDataFromSuitelet,
  saveData,
  sendData
}
