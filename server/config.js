const config = {
    server: {
        default: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        development: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        production: {
            port: 8080,
            setupData: false,
            dropDatabase:false
        },
        kamlesh: {
            port: 3002,
            setupData: false,
            dropDatabase:false
        },
        murtaza: {
            port: 3000,
            setupData: false,
            dropDatabase:false
        },
        praveen: {
            port: 3002,
            setupData: false,
            dropDatabase: false
        }
    },
    mongo: {
        default: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        kamlesh: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        khushboo: {
            dbname: 'nnxt',
            url: 'mongodb://khushboo:khushboo@ds251197.mlab.com:51197/nnxt',
            useMongoClient: true
        },
        gaurav: {
            dbname: 'nnxt-gaurav',
            url: 'mongodb://gaurav1:gaurav1@ds213338.mlab.com:13338/nnxt-gaurav',
            useMongoClient: true
        },
        murtaza: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        praveen: {
            dbname: 'nnxt',
            url: "mongodb://praveen:praveen@ds119078.mlab.com:19078/nnxt",
            useMongoClient: true
        }
    }
}

export default config