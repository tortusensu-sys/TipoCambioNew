// SchedulerService.js
// const schedule = require('node-schedule')
const cronTop = require('node-cron')

class SchedulerService {
    constructor(portals, manager) {
        this.portals = portals
        this.manager = manager
    }

    start() {
        this.portals.forEach((portal) => {
            const schedules = portal.getSchedule()
            console.log('schedules', schedules)
            schedules.forEach(({ cron: cronTime, timezone, portalId }) => {
                cronTop.schedule(cronTime, async() => {
                    try {
                        console.log(`[Portal ${portalId}] Ejecutando a las ${new Date().toISOString()}`)
                        await portal.obtainData()
                    } catch (error) {
                        console.error(`[${portalId}] Error al ejecutar:`, error)
                    }
                }, {
                    timezone
                })
            })
        })
    }
}

module.exports = SchedulerService
