import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import {UserModel} from "./models"
import co from 'co'

const strategy = new LocalStrategy(
    (username, password, done) => {
        co(async () => {
            try {
                let user = await UserModel.verifyUser(username, password)
                if (user)
                    return done(null, user)
                else
                    return done(null, false, {message: 'Login failed'})

            } catch (ex) {
                return done(null, false, {message: 'Login failed'})
            }
        })
    }
)

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user)
})

passport.deserializeUser(function (user, done) {
    done(null, user)
})
