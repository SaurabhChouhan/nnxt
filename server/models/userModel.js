import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import _ from 'lodash'
import * as ErrorCodes from '../errorcodes'
import AppError from '../AppError'
import logger from '../logger'

mongoose.Promise = global.Promise

let userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: String,
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: [{
        _id: mongoose.Schema.ObjectId,
        name: {type: String, required: true}
    }],
    phoneContact: {
        home: String,
        work: String,
        cell: String,
        other: String
    },
    badgeInformation: {
        badge: String,
        issue: Date,
        expiration: Date
    },
    emailContact: {
        other: String,
        work2: String,
        work: String
    },
    employeeAddress: {
        address: String,
        cityStateZip: String,
        addressCont: String
    },
    airportPreference: {
        airport1: String,
        airport2: String,
        airport3: String
    },
    accountNumbers: {
        tsaPreCheckNumber: String,
        marriotRewardNumber: String,
        deltaSkymilesNumber: String,
        unitedExplorerClubNumber: String,
        southwestRapidRewardsNumber: String,
        advantageNumber: String,
        emeroldClubNumber: String,
        enterprisePlusNumber: String
    },
    resetPassword: {
        oldPassword: String,
        newPassword: String,
        confirmPassword: String
    },
    emergencyContact: {
        otherEmail: String,
        work2Email: String,
        workEmail: String,
        other: String,
        cell: String,
        work: String,
        home: String,
        relation: String,
        name: String
    },
    isDeleted: {type: Boolean, default: false}
})


userSchema.statics.saveUser = async usrObj => {
    if (!usrObj.email)
        throw new Error("User's email must be passed to save user")
    if (!usrObj.password)
        throw new Error("User's password must be passed to save user")

    let count = await UserModel.count({email: usrObj.email})
    if (count !== 0)
        throw new Error("Email already registered with another user")

    usrObj.password = await bcrypt.hash(usrObj.password, 10)
    return await UserModel.create(usrObj)
}


userSchema.statics.verifyUser = async (email, password) => {
    if (_.isEmpty(email))
        throw new Error("User's email must be passed to verify user")
    if (_.isEmpty(password))
        throw new Error("User's password must be passed to verify user")

    console.log("finding user with email")
    let user = await UserModel.findOne({email: email}).lean()

    try {
        let users = await UserModel.aggregate({
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

        if (Array.isArray(users) && users.length > 0) {
            let user = users[0]
            // Need to send combined permissions of all roles

            let permissionSet = new Set()

            if (!_.isEmpty(user.roles)) {
                user.roles.forEach(r => {
                    if (!_.isEmpty(r.permissions)) {
                        r.permissions.filter(p => p.enabled).forEach(p => {
                            permissionSet.add(p.name)
                        })
                    }
                })
            }

            user.permissions = [...permissionSet]

            //user.permissions = []

            return user
        } else {
            return false
        }
    } catch (error) {
        console.log(error)
    }
    return false

}


userSchema.statics.editUser = async userObj => {
    console.log("user object ", userObj)

    // Find object by passed id
    let storedUser = await UserModel.findById(userObj._id)

    /* See if email is changed, if yes then see if email is already associated with another user */

    console.log("stored ", storedUser.email)
    console.log("user obj ", userObj.email)

    if (storedUser.email != userObj.email) {
        let count = await UserModel.count({_id: {'$ne': mongoose.Schema.ObjectId(userObj._id)}, 'email': userObj.email})
        if (count != 0) {
            throw new AppError("Email already used ", ErrorCodes.EMAIL_ALREADY_USED)
        }
    }

    if (userObj.password) {
        // clear password as we will not change password in this call
        delete userObj['password']
    }

    return await UserModel.findByIdAndUpdate(userObj._id, {$set: userObj}, {new: true}).exec()

}


userSchema.statics.updateAddedRole = async (roleInput) => {
    if (!roleInput)
        throw new AppError("Identifier required for Update", IDENTIFIER_MISSING, HTTP_BAD_REQUEST)
    let userRoleUpdate
    userRoleUpdate = await UserModel.update({'roles._id': roleInput._id}, {$set: {roleInput}}, {multi: true}).exec()
    return userRoleUpdate
}


userSchema.statics.exists = async email => {
    if (!email)
        return false
    let count = await UserModel.count({'email': email})
    if (count > 0)
        return true
    return false
}


userSchema.statics.deleteUser = async (userID) => {
    if (!userID)
        throw new AppError("Identifier required for delete", IDENTIFIER_MISSING, HTTP_BAD_REQUEST)
    return await UserModel.findByIdAndRemove(userID).exec()
}


userSchema.statics.deleteAddedRole = async (roleID) => {
    if (!roleID)
        throw new AppError("Identifier required for delete", IDENTIFIER_MISSING, HTTP_BAD_REQUEST)
    let userRoleDelete = await UserModel.updateMany({'roles._id': roleID}, {$pull: {"roles": {_id: roleID}}}, {multi: true})
    return userRoleDelete
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel