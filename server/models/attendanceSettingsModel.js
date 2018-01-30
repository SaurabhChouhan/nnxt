import mongoose from 'mongoose'


mongoose.Promise = global.Promise

let attendanceSettingsSchema = mongoose.Schema({
    MinFullDayHours:{type:Number, default:7},
    MinHalfDayHours:{type:Number, default:4},
    dayStartTime:{type:String, default:"10:00"},
    dayEndTime:{type:String, default:"22:00"}

})

const AttendanceSettingsModel = mongoose.model("attendancesettings", attendanceSettingsSchema)
export default AttendanceSettingsModel