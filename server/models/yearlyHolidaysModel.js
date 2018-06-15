import mongoose from 'mongoose'
import _ from 'lodash'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import * as U from "../utils"
import AppError from '../AppError'


mongoose.Promise = global.Promise

let yearlyHolidaysSchema = mongoose.Schema({

    calendarYear: {type: String, required: [true, "Holiday Calendar Year is required"]},
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
            holidayType: [{
                type: String,
                enum: SC.HOLIDAY_TYPE_LIST
            }],
            date: {type: Date, required: true},
            dateString: {type: String, required: true}
        }
    ]
})

yearlyHolidaysSchema.statics.getAllHolidayYearsFromServer = async (loggedInUser) => {
    if (!U.userHasRole(loggedInUser, SC.ROLE_ADMIN) && !U.userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {
        throw new AppError(" Only admin and super admin can see holidays", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    return await YearlyHolidaysModel.find({}, {
        calendarYear: 1
    }).exec()
}

yearlyHolidaysSchema.statics.getAllHolidaysOfYearFromServer = async (year, loggedInUser) => {
    if (!U.userHasRole(loggedInUser, SC.ROLE_ADMIN) && !U.userHasRole(loggedInUser, SC.ROLE_SUPER_ADMIN)) {
        throw new AppError(" Only admin and super admin can see holidays", EC.ACCESS_DENIED, EC.HTTP_FORBIDDEN)
    }

    let yearlyHoliday = await YearlyHolidaysModel.findOne({
        "calendarYear": year
    }, {
        holidays: 1
    }).exec()
    return yearlyHoliday && yearlyHoliday.holidays ? yearlyHoliday.holidays : []
}

yearlyHolidaysSchema.statics.getAllYearlyHolidaysBaseDateToEnd = async (startDateString, endDateString, loggedInUser) => {

    let startDateMoment = U.dateInUTC(startDateString)
    //  startDateString = startDateMoment.clone().toDate()
    let endDateMoment = U.dateInUTC(endDateString)
    //   endDateString = endDateMoment.clone().toDate()
    if (!startDateMoment || !endDateMoment)
        throw new AppError("conversionFailed", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    return await YearlyHolidaysModel.find({
        "holidays.date": {$gte: startDateMoment.clone().toDate(), $lte: endDateMoment.clone().toDate()}
    }).exec()
}


yearlyHolidaysSchema.statics.createHolidayYear = async holidayYear => {
    /* //   console.log("holidayYear before", holidayYear)
     if (!holidayYear.calendarYear || _.isEmpty(holidayYear.calendarYear))
         throw new AppError("Calendar Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

     let count = await YearlyHolidaysModel.count({calendarYear: holidayYear.calendarYear})
     if (count !== 0)
         throw new AppError("Calendar year already exists, please edit that or use different calendar year.", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)

     holidayYear.holidays = holidayYear.holidays.map(h => {
         let toDate = new Date(h.date)
         let toMoment = U.dateInUTC(toDate)
         return Object.assign({}, h, {
             date: toMoment.toDate(),
             dateString: toMoment
         })
     })
     //  console.log("holidayYear after ", holidayYear)*/
    return await YearlyHolidaysModel.create(holidayYear)
}


yearlyHolidaysSchema.statics.createHoliday = async holidayObj => {
    let validation = {
        "holidayName": "",
        "dateString": "",
        "holidayType": "",
        "description": "",
    }

    let holidayDate = U.dateInUTC(holidayObj.dateString)

    //count month to check month is previously created for this month
    let calendarYear = holidayDate.getFullYear()
    let calendarMonth = holidayDate.getMonth()
    let month = SC.MONTHS_WITH_MONTH_NUMBER.find(m => m.number == Number(calendarMonth))
    console.log("month", month)
    let holidayYear = await YearlyHolidaysModel.findOne({
        "calendarYear": calendarYear
    })
    let holidayYearInput = {
        calendarYear: calendarYear
    }

    let holidayMonthInput = {
        month: month.number,
        monthName: month.name
    }
    let holidayDateInput = {
        monthNo: month.number,
        holidayName: holidayObj.holidayName,
        description: holidayObj.description,
        holidayType: holidayObj.holidayType,
        date: holidayDate,
        dateString: holidayObj.dateString
    }

    if (holidayYear) {
        let holidayMonthIndex = holidayYear.holidaysInMonth && Array.isArray(holidayYear.holidaysInMonth) && holidayYear.holidaysInMonth.length ?
            holidayYear.holidaysInMonth.findIndex(hm => hm.month == Number(calendarMonth)) : -1
        let holidayDateIndex = holidayYear.holidays && Array.isArray(holidayYear.holidays) && holidayYear.holidays.length ?
            holidayYear.holidays.findIndex(hd => U.momentInUTC(holidayObj.dateString).isSame(U.momentInUTC(hd.dateString))) : -1
        if (holidayMonthIndex == -1 && holidayDateIndex == -1) {
            // push to month and date both
            console.log("holidayDateInput bk2", holidayDateInput)
            console.log("holidayMonthInput bk2", holidayMonthInput)
            holidayYear.holidaysInMonth = [...holidayYear.holidaysInMonth, holidayMonthInput]
            holidayYear.holidays = [...holidayYear.holidays, holidayDateInput]
        } else if (holidayDateIndex == -1) {
            // push to date only
            console.log("holidayDateInput bk3", holidayDateInput)
            holidayYear.holidays = [...holidayYear.holidays, holidayDateInput]
        } else {
            console.log("bk4", holidayDateInput)
            throw new AppError("Calendar Date already inserted, please create another date.", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
        }
        return await holidayYear.save()
    } else {
        holidayYearInput.holidaysInMonth = [holidayMonthInput]
        holidayYearInput.holidays = [holidayDateInput]
        console.log("holidayYearInput bk3", holidayYearInput)
        return await YearlyHolidaysModel.create(holidayYearInput)
    }
}


yearlyHolidaysSchema.statics.deleteHolidayFromYear = async (holidayDateString) => {
    if (_.isEmpty(holidayDateString))
        throw new AppError("Holiday date is required to remove holiday.", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    let holidayDate = U.dateInUTC(holidayDateString)
    let holidayDateMoment = U.momentInUTC(holidayDateString)
    let calendarMonth = holidayDate.getMonth()
    console.log("holidayDate", holidayDate)


    let holidayYear = await YearlyHolidaysModel.findOne({"holidays.date": holidayDate})

    if (!holidayYear)
        throw new AppError("Holiday year not found of this holiday.", EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)

    holidayYear.holidays = holidayYear.holidays && holidayYear.holidays.length ? holidayYear.holidays.filter(holiday => !holidayDateMoment.isSame(U.momentInUTC(holiday.dateString))) : []

    let holidayMonthIndex = holidayYear.holidays && holidayYear.holidays.length ? holidayYear.holidays.findIndex(holiday => holiday.monthNo == calendarMonth) : -1

    if (holidayMonthIndex == -1) {
        holidayYear.holidaysInMonth = holidayYear.holidaysInMonth && holidayYear.holidaysInMonth.length ? holidayYear.holidaysInMonth.filter(holidayMonth => holidayMonth.month != calendarMonth) : []
    }
    if (holidayYear.holidays && holidayYear.holidays.length) {
        return holidayYear.save()

    } else {
        return await YearlyHolidaysModel.findByIdAndRemove(mongoose.Types.ObjectId(holidayYear._id))
    }
}


yearlyHolidaysSchema.statics.updateHoliday = async holidayInput => {
    let holidayDate = U.dateInUTC(holidayInput.dateString)
    let calendarYear = holidayDate.getFullYear()
    let calendarMonth = holidayDate.getMonth()
    if (!calendarYear)
        throw new AppError("Calendar Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)

    let holidayYear = await YearlyHolidaysModel.findOne({
        "holidays._id": holidayInput._id
    })
    if (!holidayYear) {
        throw new AppError("Holiday Year is required to save Holidays.", EC.BAD_ARGUMENTS, EC.HTTP_BAD_REQUEST)
    }
    let oldHoliday = holidayYear.holidays.find(holiday => holiday._id.toString() === holidayInput._id.toString())

    // check that new date which is selected is from same year or not
    if (holidayYear.calendarYear != calendarYear && holidayYear.holidays.length > 1) {
        //pull from old holiday year and push to new holiday year
        console.log("pull from old holiday year and push to new holiday year")
        await YearlyHolidaysModel.deleteHolidayFromYear(oldHoliday.dateString)
        let holidayYearResponse = await YearlyHolidaysModel.createHoliday(Object.assign({}, holidayInput, {
            _id: null
        }))
        holidayYearResponse = holidayYearResponse.toObject()
        holidayYearResponse.yearChange = true
        return holidayYearResponse
    } else {
        let yearChange = false
        if (holidayYear.calendarYear != calendarYear) {
            holidayYear.calendarYear = calendarYear
            yearChange = true
        }

        // check that new date which is selected is from same month or not
        if (calendarMonth != oldHoliday.monthNo) {
            holidayYear.holidaysInMonth = holidayYear.holidaysInMonth.map(hm => {
                if (hm.month == oldHoliday.monthNo) {
                    let month = SC.MONTHS_WITH_MONTH_NUMBER.find(m => m.number == Number(calendarMonth))
                    return {
                        month: month.number,
                        monthName: month.name
                    }
                } else return hm
            })
        }

        let newHoliday = {}
        newHoliday.monthNo = calendarMonth
        newHoliday.holidayName = holidayInput.holidayName
        newHoliday.description = holidayInput.description
        newHoliday.holidayType = holidayInput.holidayType
        newHoliday.date = U.dateInUTC(holidayInput.dateString)
        newHoliday.dateString = holidayInput.dateString
        holidayYear.holidays = holidayYear.holidays.map(holiday => {
            if (holiday._id.toString() === holidayInput._id.toString()) {
                return newHoliday
            } else return holiday
        })
        await holidayYear.save()
        holidayYear = holidayYear.toObject()
        holidayYear.yearChange = yearChange
        return holidayYear
    }
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


const YearlyHolidaysModel = mongoose.model("yearlyholidays", yearlyHolidaysSchema)

export default YearlyHolidaysModel


/*
*
*
* {

    "calendarYear": "2018",
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