const config = {
    server: {
        default: {
            port: 3000,
            setupData: true,
            dropDatabase: false
        },
        development: {
            port: 3000,
            setupData: true,
            dropDatabase:true
        },
        production: {
            port: 8080,
            setupData: false,
            dropDatabase:false
        }
    },
    mongo: {
        default: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        khushboo: {
            url: 'mongodb://khushboo:khushboo@ds251197.mlab.com:51197/nnxt',
            useMongoClient: true
        },
        gaurav: {
            url: 'mongodb://gaurav:gaurav@ds151207.mlab.com:51207/koa-react',
            useMongoClient: true
        }
    }
}

export default config