import mongoose from 'mongoose'
import momentTZ from 'moment-timezone'
import * as SC from '../serverconstants'
import * as U from '../utils'
import logger from '../logger'

mongoose.Promise = global.Promise

let notificationSchema = mongoose.Schema({
    activeOn: {type: Date},
    activeTill: {type: Date}, // Date/Time this notification should be actively shown to user
    // Is this notification is for all employees
    broadcast: {type: Boolean, default: false},
    message: {type: String}, // with tokens
    templateName: {type: String},
    type: {type: String, enum: SC.ALL_NOTIFICATION_TYPES},
    category: {
        type: String, enum: SC.ALL_NOTIFICATION_CATEGORIES
    },
    refId: mongoose.Schema.ObjectId, // Id that uniquely identifies this notification, depends upon notification type
    data: [{
        key: {type: String},
        value: {type: String}
    }],
    source: {
        _id: mongoose.Schema.ObjectId,
        name: {type: String}
    },
    receivers: [{
        _id: mongoose.Schema.ObjectId,
        name: {type: String},
        mute: {type: Boolean, default: false}
    }],
    created: {type: Date, default: new Date()},
    updated: {type: Date, default: new Date()}
})

notificationSchema.statics.addNotification = async (notificationObj) => {
    let notification = new NotificationModel()
    notification.activeOn = momentTZ.tz(notificationObj.activeOn, SC.DATE_TIME_FORMAT, SC.UTC_TIMEZONE)
    notification.activeTill = momentTZ.tz(notificationObj.activeTill, SC.DATE_TIME_FORMAT, SC.UTC_TIMEZONE)
    notification.created = new Date()
    notification.updated = new Date()
    notification.receivers = notificationObj.receivers
    notification.source = notificationObj.source
    notification.broadcast = notificationObj.broadcast
    notification.refId = notificationObj.refId
    notification.type = notificationObj.type
    notification.category = notificationObj.category
    notification.message = notificationObj.message
    notification.templateName = notificationObj.templateName
    notification.data = notificationObj.data
    return await notification.save()
}


notificationSchema.statics.getAllActiveNotifications = async (user) => {
    // current date/time in utc for comparison
    // First formatted current date time in indian time zone and then parsed it again in UTC to get same date/time in UTC for comparison
    let sameTimeInUTC = U.getNowMomentInUTC(SC.INDIAN_TIMEZONE)
    logger.debug("getAllActiveNotifications() ", {sameTimeInUTC})

    return await NotificationModel.find({
        activeOn: {$lte: sameTimeInUTC},
        "receivers._id": user._id
    }).sort({activeOn: -1})
}


notificationSchema.statics.getCountOfTodaysNotifications = async (user) => {
    let startOfDateMoment = momentTZ.utc().startOf('day')
    let endOfDateMoment = startOfDateMoment.clone().endOf('day')
    logger.debug("getcount", {startOfDateMoment, endOfDateMoment})
    return await NotificationModel.count({
        "receivers._id": user._id,
        activeOn: {$gte: startOfDateMoment.toDate(), $lte: endOfDateMoment.toDate()}
    })
}


/*
notificationSchema.statics.isVisitedNotificationByID = async (user, notificationID) => {
    let isVisitedNotification = false
    let notification = await NotificationModel.findOne({"_id": notificationID})
    if (notification) {
        notification.isVisited = true
        notification.updated = new Date()
        let result = await notification.save()
        if (result)
            isVisitedNotification = true
    }
    return isVisitedNotification
}

notificationSchema.statics.getTodaysNotifications = async (user) => {
    let startOfDateMoment = momentTZ.tz(SC.INDIAN_TIMEZONE).startOf('day')
    let endOfDateMoment = startOfDateMoment.clone().endOf('day')
    return await NotificationModel.count({
        "receivers_id": mongoose.Types.ObjectId(user._id),
        activeOn: {$gte: startOfDateMoment, $lte: endOfDateMoment}
    })
}

notificationSchema.statics.getAllNotificationsByUser = async (user, sendType) => {
    let condition = {"to._id": user._id}
    if (sendType == "sent") {
        condition = {"from._id": user._id}
    } else if (!sendType || sendType == "received") {
        condition = {"to._id": user._id}
    }
    return await NotificationModel.find(condition).sort({created: -1})
}


notificationSchema.statics.updateNotificationStatusByID = async (notificationID, notificationStatus) => {
    let isUpdatedStatus = false
    let notification = await NotificationModel.findOne({"_id": notificationID})
    if (notification) {
        notification.status = notificationStatus
        notification.updated = new Date()
        let result = await notification.save()
        if (result)
            isUpdatedStatus = true
    }
    return isUpdatedStatus
}

notificationSchema.statics.deleteNotificationByUserAndIDs = async (user, notifications) => {
    if (notifications.length > 0) {
        notifications.forEach(async noti => {
            let notification = await NotificationModel.findOne({"_id": noti._id})
            if (!notification) {
                console.log("For Delete notification not found.")
            }
            await NotificationModel.remove({"_id": notification._id})
        })
    } else {
        throw new AppError("Notification not found.", EC.NOT_FOUND)
    }
    return ""
}

notificationSchema.statics.deleteAllNotificationsByUser = async (user, conditionObj) => {
    let userObj = await MDL.UserModel.findOne({"_id": user._id})
    if (!userObj)
        throw new AppError("User not found.", EC.NOT_FOUND)

    if (conditionObj.sendType != "sent" && conditionObj.sendType != "received") {
        throw new AppError("Notification Delete type not found.", EC.NOT_FOUND)
    }
    let condition = {}
    if (conditionObj.sendType == "sent") {
        condition = {"from._id": user._id}
    } else if (conditionObj.sendType == "received") {
        condition = {"to._id": user._id}
    }
    return await NotificationModel.remove(condition)
}
*/
const NotificationModel = mongoose.model("notification", notificationSchema)
export default NotificationModel