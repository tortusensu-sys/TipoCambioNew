// const axios = require('axios')
const SchedulerService = require('./config/portal.config')
const { PortalManager } = require('./core/portal/portalManager')
const PortalFactory = require('./utils/portalFactory')

const main = async() => {
    //  axios.post(
    //     'https://chat.googleapis.com/v1/spaces/AAAAv7K96R8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zVKshDUMFyZseIKxDgl1V0CVhqKIrUHFguuadStgLH8%3D',
    //     {
    //         cards: [
    //             {
    //                 header: {
    //                     title: 'INICIANDO SERVIDOR - EJECUTAR BOT SBS Y PORTALES',
    //                     subtitle: 'latamready@latamready.com',
    //                     imageUrl: 'https://i.ibb.co/TgF88kY/descarga.png',
    //                     imageStyle: 'IMAGE'
    //                 }
    //             }
    //         ]
    //     }
    // )
    // .then(function(response) {
    //     // console.log(response);
    // })
    // .catch(function(error) {
    //     console.error(error.toJSON())
    // })
    const prueba = new PortalManager()
    const portals = PortalFactory.createAll()

    // portals.forEach(async portal => {
    //     await prueba.append(portal)
    // })

    const schedule = new SchedulerService(portals, prueba)
    schedule.start()
}

main()
