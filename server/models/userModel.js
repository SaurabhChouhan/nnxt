import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import _ from 'lodash'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import AppError from '../AppError'
import {userHasRole} from "../utils"
import generateOTPUtil from '../notifications/generateOTP'
import NotificationUtil from '../notifications/byemail/notificationUtil'

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
    isDeleted: {type: Boolean, default: false},
    phone: String,
    address: String,
    employeeCode: {type: String, require: [true, "Unique Employee Code is required."]},
    designation: {type: String, require: [true, "Employee designation is required."]},
    dateJoined: {type: String, require: [true, "Employee Joining date is required"]},
    dateResigned: {type: String, require: false},
    lastWorkingDay: Date,
    deviceUniqueID: String,
    dob: Date,
    profileImageURL: String,
    otp:{type: Number, default:0}
})


userSchema.statics.getAllActive = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_NEGOTIATOR)) {
        // Negotiator can see estimators (Estimation Initiate), developers, leaders (company cost approximations)
        return await UserModel.find({
                "roles.name": {
                    $in: [SC.ROLE_ESTIMATOR, SC.ROLE_DEVELOPER, SC.ROLE_LEADER]
                }, isDeleted: false
            }, {password: 0}
        ).exec()
    } else if (userHasRole(loggedInUser, SC.ROLE_ADMIN)) {
        // Admin would be able to see all users except super admin
        return await UserModel.find({"roles.name": {$ne: SC.ROLE_SUPER_ADMIN}, isDeleted: false}, {password: 0}).exec()
    } else if (userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {
        // Super admin would be able to see all the users
        return await UserModel.find({isDeleted: false}, {password: 0})
    }
    else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}

userSchema.statics.getAllActiveWithRoleCategory = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_NEGOTIATOR) || userHasRole(loggedInUser, SC.ROLE_MANAGER) || userHasRole(loggedInUser, SC.ROLE_LEADER)) {

        // Negotiator can see estimators (Estimation Initiate), developers, leaders (company cost approximations)
        let Leaders = await UserModel.find({
                "roles.name": {
                    $in: [SC.ROLE_LEADER],
                    $ne: SC.ROLE_SUPER_ADMIN
                }, isDeleted: false
            }, {password: 0}
        ).exec()
        let Managers = await UserModel.find({
                "roles.name": {
                    $in: [SC.ROLE_MANAGER]
                }, isDeleted: false
            }, {password: 0}
        ).exec()
        let Developers = await UserModel.find({
                "roles.name": {
                    $in: [SC.ROLE_DEVELOPER]
                }, isDeleted: false
            }, {password: 0}
        ).exec()
        let userList = {
            managers: Managers && Managers.length ? Managers.map(m => {
                m = m.toObject()
                m.name = m.firstName + ' ' + m.lastName
                return m
            }) : [],
            leaders: Leaders && Leaders.length ? Leaders.map(l => {
                l = l.toObject()
                l.name = l.firstName + ' ' + l.lastName
                return l
            }) : [],
            team: Developers && Developers.length ? Developers.map(t => {
                t = t.toObject()
                t.name = t.firstName + ' ' + t.lastName
                return t
            }) : []
        }
        return userList
    }
    else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}


userSchema.statics.getAllActiveWithRoleDeveloper = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_MANAGER) || userHasRole(loggedInUser, SC.ROLE_LEADER) || userHasRole(loggedInUser, SC.ROLE_ADMIN) || userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {

        //Only Manager or leader can have all developer list

        let Team = await UserModel.find({
                "roles.name": {
                    $in: [SC.ROLE_DEVELOPER]
                }, isDeleted: false
            }, {firstName: 1, lastName: 1}
        ).sort({firstName: 1}).exec()

        return (Team && Team.length ? Team.map(t => {
            t = t.toObject()
            t.name = t.firstName + ' ' + t.lastName
            return t
        }) : [])
    }
    else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}


userSchema.statics.saveUser = async usrObj => {
    if (!usrObj.email)
        throw new AppError("Email must be passed to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    if (!usrObj.password)
        throw new AppError("Password must be passed to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    let count = await UserModel.count({email: usrObj.email})
    if (count !== 0)
        throw new AppError("Email already registered with another employee", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    usrObj.password = await bcrypt.hash(usrObj.password, 10)
    let totalUsers = await UserModel.count()
    usrObj.employeeCode = "AIPL-" + (totalUsers + 1)
    /*/
      if (_.isEmpty(usrObj.dateJoined))
          throw new AppError("Joining date is required to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
      //usrObj.dateJoined = Date.now();//assuming joining date is same as created date for now
      if (_.isEmpty(usrObj.designation))
          throw new AppError("Designation is required to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

  */
    let createdUser =  await UserModel.create(usrObj)
    if(createdUser) {
        let emailData = {
            user: createdUser,
            resetPasswordMessage: SC.RESET_PASSWORD_TEMPLATE_MESSAGE
        }
        NotificationUtil.sendNotification(emailData, SC.RESET_PASSWORD_TEMPLATE)
    }
    return createdUser
}


userSchema.statics.createUser = async usrObj => {

    usrObj.password = await bcrypt.hash(usrObj.password, 10)
    let totalUsers = await UserModel.count()
    usrObj.employeeCode = "AIPL-" + (totalUsers + 1)
    return await UserModel.create(usrObj)
}


userSchema.statics.verifyUser = async (email, password) => {
    if (_.isEmpty(email))
        throw new Error("User's email must be passed to verify user")
    if (_.isEmpty(password))
        throw new Error("User's password must be passed to verify user")
    let user = await UserModel.findOne({email: email}).lean()
    // verify password
    let result = await bcrypt.compare(password, user.password)

    if (!result)
        return false

    try {
        let users = await UserModel.aggregate({
            $match: {email: email}
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
                    _id: 1,
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
                password: {$first: "$password"},
                roles: {$push: "$roles"}
            }
        }).exec()

        if (Array.isArray(users) && users.length > 0) {
            let user = users[0]
            // Need to send combined permissions of all roles

            let permissionSet = new Set()
            let roleSet = new Set()

            if (!_.isEmpty(user.roles)) {
                user.roles.forEach(r => {
                    roleSet.add(r.name)
                    if (!_.isEmpty(r.permissions)) {
                        r.permissions.filter(p => p.enabled).forEach(p => {
                            permissionSet.add(p.name)
                        })
                    }
                })
            }

            user.permissions = [...permissionSet]
            user.roleNames = [...roleSet]


            if (user.firstName && user.lastName)
                user.fullName = user.firstName + ' ' + user.lastName
            else if (user.firstName)
                user.fullName = user.firstName
            else if (user.lastName)
                user.fullName = user.lastName
            else
                user.fullName = ''

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

    // Find object by passed id
    let storedUser = await UserModel.findById(userObj._id)

    /* See if email is changed, if yes then see if email is already associated with another user */

    if (storedUser.email != userObj.email) {
        let count = await UserModel.count({_id: {'$ne': mongoose.Schema.ObjectId(userObj._id)}, 'email': userObj.email})
        if (count != 0) {
            throw new AppError("Email is associated with other user!", EC.EMAIL_ALREADY_USED)
        }
    }

    if (userObj.password) {
        // this means password is changed
        if (userObj.confirmPassword && userObj.password == userObj.confirmPassword) {
            userObj.password = await bcrypt.hash(userObj.password, 10)
            //console.log("encrypted password is ", userObj.password)

        } else {
            throw new AppError("Password/Confirm password not matched ", EC.PASSWORD_NOT_MATCHED, EC.HTTP_BAD_REQUEST)
        }
    }

    let user = await UserModel.findByIdAndUpdate(userObj._id, {$set: userObj}, {new: true}).exec()
    user.password = undefined
    return user

}


userSchema.statics.updateAddedRole = async (roleInput) => {
    if (!roleInput)
        throw new AppError("Identifier required for Update", EC.IDENTIFIER_MISSING, EC.HTTP_BAD_REQUEST)
    let userRoleUpdate
    userRoleUpdate = await UserModel.update({'roles._id': roleInput._id}, {$set: {roleInput}}, {multi: true}).exec()
    return userRoleUpdate
}


userSchema.statics.exists = async email => {
    if (!email)
        throw new AppError("UserModel->exists() method needs non-null email parameter", EC.BAD_ARGUMENTS)
    let count = await UserModel.count({'email': email})
    if (count > 0)
        return true
    return false
}


userSchema.statics.deleteUser = async (userID) => {
    if (!userID)
        throw new AppError("Identifier required for delete", EC.IDENTIFIER_MISSING, EC.HTTP_BAD_REQUEST)
    return await UserModel.findByIdAndRemove(userID).exec()
}


userSchema.statics.deleteAddedRole = async (roleID) => {
    if (!roleID)
        throw new AppError("Identifier required for delete", EC.IDENTIFIER_MISSING, EC.HTTP_BAD_REQUEST)
    let userRoleDelete = await UserModel.updateMany({'roles._id': roleID}, {$pull: {"roles": {_id: roleID}}}, {multi: true})
    return userRoleDelete
}

userSchema.statics.changePassword = async (changePasswordInfo) => {
    let isPasswordChanged = false
    let oldPassword = changePasswordInfo.oldPassword
    let newPassword = changePasswordInfo.newPassword
    let confirmPassword = changePasswordInfo.confirmPassword

    let storedUser = await UserModel.findById(changePasswordInfo._id)
    if (!storedUser) {
            throw new AppError("User not found.", EC.NOT_FOUND)
    }

    let isValidUser = await UserModel.verifyUser(storedUser.email,oldPassword)
    if(!isValidUser){
        throw new AppError("Invalid old password.", EC.PASSWORD_NOT_MATCHED, EC.HTTP_BAD_REQUEST)
    }

    if (confirmPassword && newPassword) {
        // this means password is changed
        if (newPassword == confirmPassword) {
            let bcrypt_password = await bcrypt.hash(newPassword, 10)
            let userPassIsChanged = await UserModel.findByIdAndUpdate(storedUser._id, {$set: {password:bcrypt_password}}, {new: true}).exec()
            if(userPassIsChanged)
                isPasswordChanged = true
        } else {
            throw new AppError("Password/Confirm password not matched ", EC.PASSWORD_NOT_MATCHED, EC.HTTP_BAD_REQUEST)
        }
    }else {
        throw new AppError("Password/Confirm password not matched ", EC.PASSWORD_NOT_MATCHED, EC.HTTP_BAD_REQUEST)
    }

    return isPasswordChanged
}

userSchema.statics.forgotPasswordRequestM = async (email) => {
    let isUpdatedNewOtpToResetPass = false
    let storedUser = await UserModel.findOne({email:email})
    if (!storedUser) {
        //throw new AppError("User not found.", EC.NOT_FOUND)
        return isUpdatedNewOtpToResetPass
    }
    let newOTP = await generateOTPUtil.generateNewOTP()
    if(!newOTP) {
        return isUpdatedNewOtpToResetPass
    }
    let updatedNewOtpToResetPass = await UserModel.findByIdAndUpdate(storedUser._id, {$set: {otp:newOTP}}, {new: true}).exec()
    if(updatedNewOtpToResetPass) {
        isUpdatedNewOtpToResetPass = true
        let emailData = {
            user:storedUser,
            OTPMessage:SC.OTP_TEMPLATE_MESSAGE +" : "+ newOTP
        }
        NotificationUtil.sendNotification(emailData,SC.OTP_TEMPLATE)
    }
    return isUpdatedNewOtpToResetPass
}

userSchema.statics.updateNewPasswordWithOTP = async (updateNewPasswordInfo) => {
    let isResetNewPassword = false
    let storedUser = await UserModel.findOne({email:updateNewPasswordInfo.email})
    if (!storedUser) {
        throw new AppError("User not found.", EC.NOT_FOUND)
    }
    if (!updateNewPasswordInfo.otp) {
        throw new AppError("OTP not found.", EC.NOT_FOUND)
    }
    if (!updateNewPasswordInfo.password) {
        throw new AppError("New Pass not found.", EC.NOT_FOUND)
    }
    if(updateNewPasswordInfo.otp != 0 && storedUser.otp == updateNewPasswordInfo.otp){
        let bcrypt_password = await bcrypt.hash(updateNewPasswordInfo.password, 10)
        let updatedNewOtpToResetPass = await UserModel.findByIdAndUpdate(storedUser._id, {$set: {otp:0,password:bcrypt_password}}, {new: true}).exec()
        if(updatedNewOtpToResetPass) {
            isResetNewPassword = true
            let emailData = {
                user:storedUser,
                resetPasswordMessage:SC.RESET_PASSWORD_TEMPLATE_MESSAGE
            }
            NotificationUtil.sendNotification(emailData,SC.RESET_PASSWORD_TEMPLATE)
        }
    }else{
        throw new AppError("Invalid OTP.", EC.INVALID_OPERATION)
    }
    return isResetNewPassword
}

const UserModel = mongoose.model("User", userSchema)
export default UserModel