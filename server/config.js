const config = {
    server: {
        default: {
            port: 3000,
            setupData: false,
            dropDatabase: false,
            mode: 'production',
            eventInterval: 60000
        },
        development: {
            port: 3000,
            setupData: false,
            mode: 'development',
            dropDatabase: false
        },
        setupData: {
            port: 3000,
            setupData: true,
            dropDatabase: false
        },
        demoData: {
            port: 3001,
            setupData: true,
            dropDatabase: true
        },
        production: {
            port: 3000,
            setupData: false,
            dropDatabase: false,
            mode: 'production',
            eventInterval: 1800000
        },
        migration: {
            port: 3000,
            setupData: true,
            dropDatabase: false,
            mode: 'production'
        },
        kamlesh: {
            port: 3002,
            setupData: false,
            dropDatabase: false
        },
        murtaza: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        praveen: {
            port: 3002,
            setupData: false,
            dropDatabase: false
        },
        anup: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        gaurav_local: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        gaurav: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        ravi: {
            port: 3000,
            setupData: false,
            dropDatabase: false
        },
        ratnesh: {
            port: 3002,
            setupData: false,
            dropDatabase: false
        },
        khushboo: {
            port: 3000,
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
        production: {
            dbname: 'nnxt',
            url: 'mongodb://nnxtadmin:1nn0cu0us@localhost/nnxt',
            useMongoClient: true
        },
        migration: {
            dbname: 'nnxt',
            url: 'mongodb://nnxtadmin:1nn0cu0us@localhost/nnxt',
            useMongoClient: true
        },
        demoData: {
            dbname: 'demo',
            url: 'mongodb://demoadmin:an1mos1ty@localhost/demo',
            useMongoClient: true
        },
        setupData: {
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
            url: 'mongodb://localhost:27017/khushboo_nnxt',
            useMongoClient: true
        },
        gaurav: {
            dbname: 'nnxt-gaurav',
            url: 'mongodb://gaurav1:gaurav1@ds213338.mlab.com:13338/nnxt-gaurav',
            useMongoClient: true
        },
        pogras: {
            dbname: 'nnxt-pogras',
            url: 'mongodb://mpogra:mpogra@ds117848.mlab.com:17848/nnxt-pogras',
            useMongoClient: true
        },
        murtaza: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        praveen: {
            dbname: 'nnxt',
            url: "mongodb://localhost/nnxt",
            useMongoClient: true
        },
        anup: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        gaurav_local: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        ravi: {
            dbname: 'nnxt',
            url: 'mongodb://localhost/nnxt',
            useMongoClient: true
        },
        ratnesh: {
            dbname: 'ratnesh_nnxt',
            url: "mongodb://192.168.1.55:27017/ratnesh_nnxt",
            useMongoClient: true
        }
    }
}

export default config