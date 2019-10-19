module.exports = {
    dev: {
        name: 'development',
        host: 'localhost',
        port: 8000,
        apiURL: 'http://localhost:8000/rest/',
        staticURL: 'statics/'
    },
    local: {
        name: 'local',
        host: "http://localhost:8000/admin",
        apiURL: 'http://localhost:8000/rest/',
        staticURL: 'http://localhost:8000/statics/admin/'
    },
    pro: {
        name: 'production',
        host: "http://moaianalytics.com/endesa/admin",
        apiURL: 'http://moaianalytics.com/endesa/rest/',
        staticURL: 'http://moaianalytics.com/endesa/statics/admin/'
    }
}