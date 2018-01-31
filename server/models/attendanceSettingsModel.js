import mongoose from 'mongoose'
import YearlyHolidaysModel from "./yearlyHolidaysModel";
import AppError from "../AppError";
import {userHasRole} from "../utils";
import * as SC from "../serverconstants";
import * as EC from "../errorcodes";


mongoose.Promise = global.Promise

let attendanceSettingsSchema = mongoose.Schema({

    minFullDayHours:{type:Number, default:7},
    minHalfDayHours:{type:Number, default:4},
    dayStartTime:{type:String, default:"10:00"},
    dayEndTime:{type:String, default:"22:00"}

})
/*I am hoping that default add / update / delete of super will work here */

attendanceSettingsSchema.statics.getAdminAttendanceSettings = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_ADMIN) || userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {
        // Only admin and super admin can see holidays
        let settings =  await AttendanceSettingsModel.find().exec()
        if(!settings)
        {
            /**Default settings creation */
            settings = new AttendanceSettingsModel();
            return await AttendanceSettingsModel.create(settings)

        }
    }
    else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}

attendanceSettingsSchema.updateAdminAttedanceSettings = async (newSettings) => {
    if (userHasRole(loggedInUser, SC.ROLE_ADMIN) || userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {
        let settings = await AttendanceSettingsModel.getAdminAttendanceSettings()
        settings.minFullDayHours = newSettings.minFullDayHours;
        settings.minHalfDayHours = newSettings.minHalfDayHours;
        settings.dayStartTime = newSettings.dayStartTime;
        settings.dayEndTime = newSettings.dayEndTime;


        return await AttendanceSettingsModel.update(settings);
    }
    else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

}
const AttendanceSettingsModel = mongoose.model("attendancesettings", attendanceSettingsSchema)
export default AttendanceSettingsModel