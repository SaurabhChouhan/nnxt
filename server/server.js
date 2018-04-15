import Koa from 'koa'
import koaBody from 'koa-body'
import views from 'koa-views'
import cookie from 'koa-cookie'
import staticCache from 'koa-static-cache'
import passport from 'koa-passport'
import koaSession from 'koa-session'
import noConfig from 'no-config'
import confFile from './config'
import co from 'co'
import mongoose from 'mongoose'
import {apiRouter, pageRouter} from "./routers"
import {addInitialData, addNNXTData} from "./utils/setupdata"
import {PROD_ENV} from "./serverconstants"
import path from 'path'
import logger from './logger'
import {HTTP_SERVER_ERROR} from "./errorcodes"


// Initializing configuration first and then starting application
co(async () => {
    let conf = await noConfig({config: confFile})

    mongoose.Promise = global.Promise
    let connection;
    try {

        connection = await mongoose.connect(conf.mongo.url, {
            "useMongoClient": conf.mongo.useMongoClient
        })
        logger.info("Connection to database Successful!")
    } catch (error) {
        logger.error("Error connecting to database, please check your configurations...")
        return
    }

    if (conf.server.dropDatabase) {
        logger.warn("DROP DATABASE CONFIGURATION IS ON!!! PLEASE RESET IF DON'T INTEND TO DROP DATABASE IN NEXT SERVER START")
        logger.info("DROPPING DATABASE")
        try {
            let names = await connection.db.listCollections().toArray()
            try {
                let dropPromises = await names.forEach(n => connection.dropDatabase(conf.mongo.dbname))
            } catch (error) {
                logger.error(error)
            }

            //let dropCollection = connection.db.dropCollection()

        } catch (error) {
            logger.error("Error dropping collections ", error)
            return
        }
    }


    if (conf.server.setupData) {
        logger.info("SETUP DATA CONFIGURATION IS ON! In case you don't want to run setup instructions please set that config to false")
        await addInitialData()
        await addNNXTData()
    }
    let app = new Koa()

    app.use(cookie())
    app.use(koaBody({multipart: true, formidable: {keepExtensions: true}}))
    app.keys = ['A secret that no one knows']
    app.use(koaSession({}, app))

// authentication
    require('./auth')
    app.use(passport.initialize())
    app.use(passport.session())

// Mustache would be used as a template engine to render pages
    app.use(views(__dirname + '/views',
        {
            map: {
                html: 'mustache'
            },
            extension: 'mustache',
            debug: true,
            options: {
                partials: {}
            }
        }
    ));


    // Cache public resources on production

    if (process.env.NODE_ENV && process.env.NODE_ENV == PROD_ENV) {
        // Public files would be served from public folder (js,css, images etc), with max age as 1 year
        app.use(staticCache(path.join(__dirname, 'public'), {
            maxAge: 365 * 24 * 60 * 60
        }))
    } else {
        // For dev environment no caching of files would be done
        app.use(staticCache(path.join(__dirname, 'public'), {
            maxAge: 0
        }))
    }

    /**
     * Below code is error handler code which would receive both errors and success response
     */

    app.use(async (ctx, next) => {
        try {
            let response = await next()
            if (response !== undefined) {
                ctx.body = {
                    success: true,
                    data: response
                }
            }

        } catch (err) {
            logger.error("Server ERROR:", {error: err})
            ctx.status = err.status || HTTP_SERVER_ERROR
            ctx.body = ctx.body = {
                success: false,
                code: err.code,
                message: err.message,
                errors: err.errors
            }
            ctx.app.emit('error', err, ctx);
        }
    });

    app.use(function (ctx, next) {
        ctx.flash = function (type, msg) {
            ctx.session.flash = {type: type, message: msg};
        }
        return next();
    });


    // All server pages (including server side rendering pages)
    app.use(pageRouter.routes())
    // All APIs starts with /api
    app.use(apiRouter.routes())

    app.listen(conf.server.port, () => {
        logger.info('Server started on %s', conf.server.port)
    })
})