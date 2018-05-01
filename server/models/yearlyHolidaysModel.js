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
            monthName: {type: String, required: [true, "Month name is required"]}
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
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    var startDateMoment = momentTZ.tz(startDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    var endDateMoment = momentTZ.tz(endDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let selectedHolidays = await YearlyHolidaysModel.find({
        "holidays.date": {$gte: startDateMoment, $lte: endDateMoment}

    }).exec()
    console.log("selectedHolidays", selectedHolidays)
    return selectedHolidays
}


yearlyHolidaysSchema.statics.createHolidayYear = async holidayYear => {
    console.log("holidayYear before", holidayYear)
    if (!holidayYear.calenderYear || _.isEmpty(holidayYear.calenderYear))
        throw new AppError("Calender Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    let count = await YearlyHolidaysModel.count({calenderYear: holidayYear.calenderYear})
    if (count !== 0)
        throw new AppError("Calender year already exists, please edit that or use different calender year.", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    holidayYear.holidays = holidayYear.holidays.map(h => {
        let toDate = new Date(h.date)
        let toMoment = momentTZ.tz(toDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        return Object.assign({}, h, {
            date: toMoment.toDate()
        })
    })
    console.log("holidayYear after ", holidayYear)
    return await YearlyHolidaysModel.create(holidayYear)
}


yearlyHolidaysSchema.statics.createHoliday = async holiday => {
    console.log("holiday before moment ", holiday)
    holiday.date = new Date(holiday.date)
    let toMoment = momentTZ.tz(holiday.date, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    let holidayDate = toMoment.toDate()
    holiday.date = holidayDate


    // count date to check date is already inserted or not

    let countDate = await YearlyHolidaysModel.count({"holidays.date": holidayDate})
    if (countDate !== 0)
        throw new AppError("Calender Date already inserted, please create another date.", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)


    //count year to check year for year is already created or not
    console.log("holiday after moment", holiday)
    console.log(" holiday.date", holidayDate)
    console.log(" holiday.date", holidayDate.getFullYear())
    let calenderYear = holidayDate.getFullYear()
    console.log("calenderYear", calenderYear)
    if (!calenderYear)
        throw new AppError("Calender Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    let countYear = await YearlyHolidaysModel.count({calenderYear: calenderYear})
    if (countYear === 0)
        throw new AppError("Calender year not exists, please create calender year First.", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

    //count month to check month is previously created for this month
    let calenderMonth = holiday.date.getMonth()
    let countMonth = await YearlyHolidaysModel.count({
        "calenderYear": calenderYear,
        "holidaysInMonth.month": calenderMonth
    })
    console.log("countMonth", countMonth)
    if (countMonth == 0) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let calenderMonthStructure = {
            month: calenderMonth,
            monthName: months[calenderMonth]
        }
        //we have to push month as well as holiday entry date"
        console.log("we have to push month as well as holidayEntryDate")
        await YearlyHolidaysModel.update({
            'calenderYear': calenderYear
        }, {$push: {"holidaysInMonth": calenderMonthStructure, "holidays": holiday}}).exec()

    } else {
        console.log("we need to update month and push holidayEntryDate")
        await YearlyHolidaysModel.update({
            'calenderYear': calenderYear
        }, {
            $push: {"holidays": holiday}
        }).exec()
    }
    return holiday
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
            "monthName": "january"
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