// OBJECT WITH GLOBAL VISIBILITY ON THE CLIENT WITH 
// INFORMATION ABOUT HOW TO REACH THE SERVER

module.exports = {
    dev: {
        name: 'development',
        host: 'localhost',
        port: 8050,
        apiURL: '/statics/data/',
        staticsURL: '/statics/'
    },
    pre: {
        name: 'preproduction',
        host: 'http://pre.domain.com/path',
        apiURL: 'http://pre.domain.com/path/rest/',
        staticsURL: 'http://pre.domain.com/path/statics/'
    },
    pro: {
        name: 'production',
        host: "http://domain.com/path",
        apiURL: 'http://domain.com/path/rest/',
        staticsURL: 'http://domain.com/path/app/statics/'
    }
}