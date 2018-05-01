import mongoose from 'mongoose'
import _ from 'lodash'
import momentTZ from 'moment-timezone'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import AppError from '../AppError'
import {userHasRole} from "../utils"


mongoose.Promise = global.Promise

let yearlyHolidaysSchema = mongoose.Schema({

    calenderYear: {type: String, required: [true, "Holiday Calender Year is required"]},
    totalCalendarLeave: {type: Number, default: 15},
    casualLeave: {type: Number, default: 15},
    paternityLeave: {type: Number, default: 5},
    maternityLeave: {type: Number, default: 45},
    festivalLeave: {type: Number, default: 2},
    marriageLeave: {type: Number, default: 7},
    officialHolidays: {type: Number, default: 10},
    maxCLPerMonth: {type: Number, default: 3},
    permittedContinuousLeave: {type: Number, default: 3},
    holidaysInMonth: [
        {
            month: {type: Number, default: 0},
            monthName: {type: String, required: [true, "Month name is required"]},
            noOfHolidays: {type: Number, default: 0}
        }
    ],
    holidays: [
        {
            monthNo: {type: Number, default: 0},
            holidayName: {type: String, required: [true, "Holiday name is required"]},
            description: String,
            holidayType: {type: String, required: [true, "Holiday type is required"]},//"Emergency,Public Holiday,National Day,Gazetted Holidays"
            date: {type: Date, required: true}
        }
    ]
})

yearlyHolidaysSchema.statics.getAllYearlyHolidays = async (loggedInUser) => {
    if (userHasRole(loggedInUser, SC.ROLE_ADMIN) || userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {
        // Only admin and super admin can see holidays
        return await YearlyHolidaysModel.find({}).exec()
    }
    else {
        throw new AppError("Access Denied", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }
}

yearlyHolidaysSchema.statics.getAllYearlyHolidaysBaseDateToEnd = async (startDate, endDate, loggedInUser) => {
    var startDateMoment = momentTZ.tz(startDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    var endDateMoment = momentTZ.tz(endDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let selectedHolidays = await YearlyHolidaysModel.find({
        "holidays.date": {$gte: startDateMoment, $lte: endDateMoment}

    }).exec()
    console.log("selectedHolidays", selectedHolidays)
    return selectedHolidays
}


yearlyHolidaysSchema.statics.createHolidayYear = async holidayYear => {
    console.log("holidayYear", holidayYear)
    if (_.isEmpty(holidayYear.calenderYear))
        throw new AppError("Calender Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    let count = await YearlyHolidaysModel.count({calenderYear: holidayYear.calenderYear})
    if (count !== 0)
        throw new AppError("Calender year already exists, please edit that or use different calender year.", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    /*
    if (!usrObj.password)
         throw new AppError("Password must be passed to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

     let count = await UserModel.count({email: usrObj.email})
     if (count !== 0)
         throw new AppError("Email already registered with another employee", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

     usrObj.password = await bcrypt.hash(usrObj.password, 10)
     let totalUsers = await UserModel.count()
     usrObj.employeeCode = "AIPL-"+(totalUsers+1)
     if (_.isEmpty(usrObj.dateJoined))
         throw new AppError("Joining date is required to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
     //usrObj.dateJoined = Date.now();//assuming joining date is same as created date for now
     if (_.isEmpty(usrObj.designation))
         throw new AppError("Designation is required to save employee", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
 */
    return await YearlyHolidaysModel.create(holidayYear)
}


yearlyHolidaysSchema.statics.updateHolidayYear = async holidayYearInput => {
    console.log("holidayYearInput", holidayYearInput)
    if (_.isEmpty(holidayYearInput.calenderYear))
        throw new AppError("Calender Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    let count = await YearlyHolidaysModel.count({calenderYear: holidayYearInput.calenderYear})
    if (count == 0)
        throw new AppError("Calender year not exists, please create that or use different calender year.", EC.NOT_EXISTS, EC.HTTP_BAD_REQUEST)


    let holidayYear = await YearlyHolidaysModel.find({
        "calenderYear": holidayYearInput.calenderYear
    })

    holidayYear.holidaysInMonth[0].push(holidayYearInput.holidaysInMonth[0])
    holidayYear.holidays[0].push(holidayYearInput.holidays[0])
   
    return await holidayYear.save
}

yearlyHolidaysSchema.statics.addHolidayToYear = async (holidayYearID, holidayObj) => {
    let holidayYear = await YearlyHolidaysModel.findById(holidayYearID)
    if (!holidayYear)
        throw new AppError("Invalid holiday year.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    if (_.isEmpty(holidayObj.holidayName))
        throw new AppError("Holiday name is required to save Holiday.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    if (_.isEmpty(holidayObj.date))
        throw new AppError("Holiday date is required to save Holiday.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    holidayYear.holidays.push(holidayObj);
    let queryResponse = await holidayYear.save()
    return queryResponse.holidays[queryResponse.holidays.length - 1];

}

yearlyHolidaysSchema.statics.updateHolidayToYear = async (holidayYearID, holidayObj) => {


}
yearlyHolidaysSchema.statics.deleteHolidayFromYear = async (holidayYearID, holidayObj) => {
    let holidayYear = await YearlyHolidaysModel.findById(holidayYearID)

    if (!holidayYear)
        throw new AppError("Invalid holiday year.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    if (_.isEmpty(holidayObj._id))
        throw new AppError("Holiday id is required to remove Holiday.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    await YearlyHolidaysModel.update(
        {_id: holidayYearID},
        {$pull: {holidays: {_id: holidayObj._id}}},
        {multi: false});
    return holidayObj;
    // holidayYear.holidays.pop({_id:holidayObj._id});
}
const YearlyHolidaysModel = mongoose.model("yearlyholidays", yearlyHolidaysSchema)

export default YearlyHolidaysModel


/*
*
*
* {

    "calenderYear": "2018",
    "totalCalendarLeave": 15,
    "casualLeave": 15,
    "paternityLeave": 5,
    "maternityLeave": 45,
    "festivalLeave": 2,
    "marriageLeave": 7,
    "officialHolidays": 10,
    "maxCLPerMonth": 3,
    "permittedContinuousLeave": 3,
    "holidaysInMonth": [
        {
            "month": 0,
            "monthName": "january",
            "noOfHolidays": 1
        }
    ],
    "holidays": [
        {
        	"monthNo": 0,
            "holidayName": "Republic Day",
            "description": "Republic Day",
            "holidayType": "Public",
            "date": "Friday, January 26, 2018 12:00:00 AM GMT+05:30"
        }
    ]
}
*/