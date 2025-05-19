class PortalManager {
    constructor() {
        this.array = []
    }

    async append(portal) {
        try {
            await portal.obtainData()
            return console.log('todo correcto')
        } catch (error) {
            console.log('error', error)
        }
    }
}

module.exports = { PortalManager }
