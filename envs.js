module.exports = {
    dev: {
        name: 'development',
        host: 'localhost',
        port: 8050,
        apiURL: 'http://localhost:8050/assets/data/',
        staticURL: 'http://localhost:8050/assets/'
    },
    pre: {
        name: 'preproduction',
        host: "http://localhost:8000",
        apiURL: 'http://localhost:8000/rest/',
        staticURL: 'http://localhost:8000/statics/admin/'
    },
    pro: {
        name: 'production',
        host: "https://domain.com/project",
        apiURL: 'https://domain.com/project/rest/',
        staticURL: 'https://domain.com/project/statics/'
    }
}