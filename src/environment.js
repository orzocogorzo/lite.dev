module.exports = {
    dev: {
        name: 'development',
        host: 'localhost',
        port: 8000,
        apiURL: 'http://localhost:8000/rest/',
        staticURL: '/statics'
    },
    pre: {
        name: 'development',
        host: 'localhost',
        port: 8000,
        apiURL: 'rest/',
        staticURL: 'statics/'
    },
    pro: {
        name: 'production',
        host: "http://moaianalytics.com/insights",
        apiURL: 'http://moaianalytics.com/insights/rest/',
        userURL: "http://moaianalytics.com/insights/user/",
        staticURL: 'http://moaianalytics.com/insights/app/statics/'
    }
}