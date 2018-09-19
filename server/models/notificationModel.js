import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "../models"
import moment from 'moment'
import * as SC from "../serverconstants";

import momentTZ from 'moment-timezone'

mongoose.Promise = global.Promise


let notificationSchema = mongoose.Schema({
    from: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String},
        lastName: {type: String},
        employeeCode: String,
    },
    to: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String},
        lastName: {type: String},
        employeeCode: String,
    },

    notificationSendBy: String, //Email , SMS , Mobile-notification
    notificationSubject: String, //Title of Notification
    notificationType:String,    //Reason of sending like(Estimation created, review-requested task assigned ect.)
    notificationBody:String,  // Ready to send

    notificationBodyText:String,  // This use for NNXT Notifications view

    status:String, //Pending, Sent, Failed
    created:{type: Date,default:new Date()},
    updated:{type: Date,default:new Date()},
    isDeleted:{type:Boolean,default:false},
    isVisited:{type:Boolean,default:false}
})

notificationSchema.statics.isVisitedNotificationByID = async (user,notificationID) => {
    let isVisitedNotification = false
    let notification = await NotificationModel.findOne({"_id" : notificationID})
    if(notification){
        notification.isVisited = true
        notification.updated = new Date()
        let result =  await notification.save()
        if(result)
            isVisitedNotification = true
    }
    return isVisitedNotification
}

notificationSchema.statics.getAllTodayNotificationsByUser = async (user) => {
    let currentMoment = moment()
    let startOfDateMoment = currentMoment.startOf('day')
    let endOfDateMoment = startOfDateMoment.clone().endOf('day')
    return await NotificationModel.count({$or:[{'to._id':user._id},{'from._id':user._id}],isVisited:false,created:{$gte:startOfDateMoment,$lte:endOfDateMoment}})
}

notificationSchema.statics.getAllNotificationsByUser = async (user,sendType) => {
    //by default call api for received notifications
    //user._id = '5b87dea5749236069ce6943f'
    let condition = { "to._id":user._id}
    if(sendType == "sent"){
        condition = { "from._id":user._id}
    }else if(!sendType || sendType == "received"){
        condition = { "to._id":user._id}
    }
    return await NotificationModel.find(condition).sort({created:-1})
}

notificationSchema.statics.addNotification = async (notificationObj) => {
    //console.log("notificationObj ",notificationObj)
    let notification = {
        from: notificationObj.from,
        to:notificationObj.to,

        notificationSendBy:notificationObj.notificationSendBy,
        notificationSubject: notificationObj.notificationSubject,
        notificationType: notificationObj.notificationType,
        notificationBody: notificationObj.notificationBody,

        notificationBodyText: notificationObj.notificationBodyText,

        status:notificationObj.status,
        created:new Date(),
        updated:new Date(),
        isDeleted:false
    }
    return await NotificationModel.create(notification)
}

notificationSchema.statics.updateNotificationStatusByID = async (notificationID,notificationStatus) => {
    let isUpdatedStatus = false
    let notification = await NotificationModel.findOne({"_id" : notificationID})
    if(notification){
        notification.status = notificationStatus
        notification.updated = new Date()
        let result =  await notification.save()
        if(result)
            isUpdatedStatus = true
    }
    return isUpdatedStatus
}

notificationSchema.statics.deleteNotificationByUserAndIDs = async (user,notifications) => {
    if(notifications.length > 0){
        notifications.forEach(async noti => {
            let notification = await NotificationModel.findOne({"_id" : noti._id})
            if(!notification){
                console.log("For Delete notification not found.")
            }
            await NotificationModel.remove({"_id" : notification._id})
        })
    }else{
        throw new AppError("Notification not found.", EC.NOT_FOUND)
    }
    return ""
}

notificationSchema.statics.deleteAllNotificationsByUser = async (user,conditionObj) => {
    let userObj = await MDL.UserModel.findOne({"_id":user._id})
    if(!userObj)
        throw new AppError("User not found.", EC.NOT_FOUND)

     if(conditionObj.sendType != "sent" && conditionObj.sendType != "received" ){
        throw new AppError("Notification Delete type not found.", EC.NOT_FOUND)
    }
    let condition = {}
    if(conditionObj.sendType == "sent"){
        condition = { "from._id":user._id}
    }else if(conditionObj.sendType == "received"){
        condition = { "to._id":user._id}
    }
    return await NotificationModel.remove(condition)
}

const NotificationModel = mongoose.model("notification", notificationSchema)
export default NotificationModel