import Router from 'koa-router'
import passport from 'koa-passport'
import * as MDL from "../models"
import AppError from '../AppError'
import * as EC from '../errorcodes'


/**
 * All authentication releated APIs would go here
 * @type {Router}
 */


const publicRouter = new Router()

publicRouter.post('/login', async (ctx, next) => {
    await passport.authenticate('local', (err, user, info, status) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            console.log("***info***", info, "*****status*****", status)
            throw new AppError(info.message, EC.LOGIN_FAILED, 401)
        }

        // remove password information from user
        user.password = undefined
        ctx.loggedInUser = user;


    })(ctx, next)

    await ctx.login(ctx.loggedInUser)
    return ctx.loggedInUser
})

publicRouter.get('/execute', async ctx => {
    console.log("execute query")
    /*
    return await MDL.UserModel.create({
        "firstName": "Test1",
        "lastName": "Test1",
        "roles": [{
            "name": "Super Admin"

        }, {
            "name": "Negotiator"
        }],
        "email": "test1@test.com",
        "password": "abcdef"
    })
    */
    //return await MDL.UserModel.find({})
    //return await MDL.UserModel.findOne({email:'admin@test.com'})
    //return await MDL.UserModel.findOne({email:'admin@test.com'},{firstName:1, lastName:1})
//    return await MDL.UserModel.find({"roles.name":{$in:'Estimator'}})
    //return await MDL.UserModel.findOneAndUpdate({email:'schouhan@aripratech.com'}, {$set:{'firstName':'Ekaksh'}}, {new:true})


    return await MDL.UserModel.aggregate({
        $match: {email: 'appuser@test.com'}
    }, {
        $unwind: {
            path: "$roles"
        }
    }, {
        $lookup: {
            from: 'roles',
            localField: 'roles._id',
            foreignField: '_id',
            as: 'roles'
        }
    }, {
        $unwind: {path: "$roles"}
    }, {
        $project: {
            email: 1,
            firstName: 1,
            lastName: 1,
            roles: {
                name: 1,
                permissions: {
                    $filter: {
                        input: "$roles.permissions",
                        as: "permission",
                        cond: {$eq: ['$$permission.enabled', true]}
                    }
                }
            }
        }
    }, {
        $group: {
            _id: "$_id",
            email: {$first: "$email"},
            firstName: {$first: "$firstName"},
            lastName: {$first: "$lastName"},
            roles: {$push: "$roles"}
        }
    }).exec()
})

export default publicRouter