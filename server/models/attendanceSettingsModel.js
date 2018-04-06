import mongoose from 'mongoose'

mongoose.Promise = global.Promise

let attendanceSettingsSchema = mongoose.Schema({

    minFullDayHours: {type: Number, default: 7},
    minHalfDayHours: {type: Number, default: 4},
    dayStartTime: {type: String, default: "10:00"},
    dayEndTime: {type: String, default: "22:00"}

})

/*I am hoping that default add / update / delete of super will work here */

attendanceSettingsSchema.statics.get = async (loggedInUser) => {
    return await AttendanceSettingsModel.findOne()
}

attendanceSettingsSchema.statics.updateSetting = async (newSettings, loggedInUser) => {
    let attendanceSetting = await AttendanceSettingsModel.findOne()

    if (!attendanceSetting) {
        return await AttendanceSettingsModel.create(newSettings)
    } else {
        return await AttendanceSettingsModel.findOneAndUpdate({}, {$set: newSettings}, {new: true})
    }
}

const AttendanceSettingsModel = mongoose.model("attendancesettings", attendanceSettingsSchema)
export default AttendanceSettingsModel