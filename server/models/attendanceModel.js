import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "../models"
import moment from 'moment'
import * as SC from "../serverconstants";

import momentTZ from 'moment-timezone'

mongoose.Promise = global.Promise


let attendanceSchema = mongoose.Schema({
    user: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: [true, 'User first name is required']},
        lastName: {type: String, required: [true, 'User last name is required']},
        employeeCode: String,
    },
    date: {type: String, required: [true, 'Date is required']},
    totalMinutesSpent: {type: Number},
    lastAction: String,
    lastEntryId: mongoose.Schema.ObjectId,
    entries: [{
        checkIn: String,
        checkOut: String,
        minuteSpend: {type: Number, default: 0},
    }],
    status: String
})

/*let attendanceSchema = mongoose.Schema({
    user_id:{
        type: String, required: [true, 'Client name is required']
    },
    date: String,required: [true, 'date is required'],
    time: String,required: [true, 'date is required']
})*/

function getEntrySum(total, entry) {
    return {minuteSpend: total.minuteSpend + entry.minuteSpend};
}

function getStatus(totalSpendMinutes) {
    if (totalSpendMinutes < SC.MINIMUM_HALF_DAY_MINUTE) {
        return SC.ABSENT
    } else if (totalSpendMinutes >= SC.MINIMUM_HALF_DAY_MINUTE && totalSpendMinutes > SC.MINIMUM_FULL_DAY_MINUTE) {
        return SC.HHALF_DAY
    } else if (totalSpendMinutes >= SC.MINIMUM_FULL_DAY_MINUTE) {
        return SC.FULL_DAY
    }
}

/*
*
*   1. Get user from user document using employeeCode
    2. Get Entry from Attendance document for the current date of above user.
        a. If Entry is not found create new entry for above user, with status arrived,
            last action to checkIn and make an entry with in time in
            entries array and use this id in last entry id.
        b. If entry is found then check last action.
            A. If last action is CheckIn then get last entry in entries using lastEntryId
                and update checkout time with given time and update last action to check out
                and update hourSpend variable by calculating total entries time from all entries checkin,
                checkout time also update status by hourspend variable using pre configuration (attendance settings).
            B. If last action is checkout just make a new entry in ertries array with chekin time
               and update last action to checkin and lastEntryId to inserted id.
*
* */

attendanceSchema.statics.addUpdateAttendance = async (attendanceInfo) => {
    let currentDate = momentTZ.tz(SC.INDIAN_TIMEZONE).format(SC.DATE_FORMAT)
    let currentTime = momentTZ.tz(SC.INDIAN_TIMEZONE).format(SC.TIME_FORMAT_24_HOURS)
    //console.log("todayDate " + currentDate);
    //console.log("todayTime " + currentTime);

    let user = await MDL.UserModel.findOne({"employeeCode": attendanceInfo.employee_code});
    if (!user) {
        throw new AppError("User not found", EC.NOT_FOUND, 404);
    }
    //console.log("***Found User *** \n ", user);

    let attendance = await AttendanceModel.findOne({"user.employeeCode": user.employeeCode, "date": currentDate});
    //console.log("***Found attendance *** \n ", attendance);
    if (!attendance) {
        // create new entry...
        console.log("***Attendance document not found for user so just need to create it.");
        let attendanceOBJ = {
            user: user,
            date: currentDate,
            totalMinutesSpent: 0,
            lastAction: "checkin",
            entries: [{
                checkIn: currentTime,
                checkOut: "",
                minuteSpend: 0,
            }],
            status: SC.ARRIVED
        };

        let createdAttendanceObj = await AttendanceModel.create(attendanceOBJ);
        createdAttendanceObj.lastEntryId = createdAttendanceObj.entries[0]._id;
        await  createdAttendanceObj.save();
        //console.log("***Created attendance entry is *** \n ", createdAttendanceObj);
        console.log("*** New attandance entry created for user " + attendanceInfo.employee_code);
    }
    else {
        console.log("***Attendance document found for user so just need to update it.");
        //console.log("***lastAction is ." + attendance.lastAction);
        if (attendance.lastAction == "checkin") {
            // update entry for checkout...
            attendance.entries[attendance.entries.length - 1].checkOut = currentTime;
            attendance.lastAction = "checkout";
            attendance.lastEntryId = attendance.entries[attendance.entries.length - 1]._id;
            await  attendance.save();
            //console.log("***Updated attendance entry is *** \n ", attendance);

            // Need to calculate total spend time in minute for this entry.

            let checkoutMoment = moment(currentTime, SC.TIME_FORMAT_24_HOURS);

            let checkoutMomentString = checkoutMoment.format(SC.DATE_AND_DAY_SHOW_FORMAT);

            // console.log("checkoutMomentString " + checkoutMomentString);

            let checkinMoment = moment(attendance.entries[attendance.entries.length - 1].checkIn, SC.TIME_FORMAT_24_HOURS);

            let checkinMomentString = checkinMoment.format(SC.DATE_AND_DAY_SHOW_FORMAT);

            //console.log("checkinMomentString " + checkinMomentString);

            var duration = moment.duration(checkoutMoment.diff(checkinMoment));
            var spendMinutes = duration.asMinutes();

            // console.log("Spend Minutes " + spendMinutes);
            attendance.entries[attendance.entries.length - 1].minuteSpend = spendMinutes;

            await  attendance.save();


            let totalSpendMinutes = attendance.entries.reduce(getEntrySum).minuteSpend;
            //console.log("totalSpendMinutes " + totalSpendMinutes);

            attendance.totalMinutesSpent = totalSpendMinutes;

            // Need to update status according to totalMinutesSpent

            attendance.status = getStatus(totalSpendMinutes);

            await  attendance.save();

            console.log("*** Updated attandance entry for user " + attendanceInfo.employee_code);
        } else {
            // last action is check out so need to create new entry with check in...
            let entry = attendance.entries;
            entry.push({
                checkIn: currentTime,
                checkOut: "",
                minuteSpend: 0,
            })
            attendance.entries = entry;
            attendance.status = SC.ARRIVED;
            attendance.lastAction = "checkin";
            attendance = await  attendance.save();
            attendance.lastEntryId = attendance.entries[attendance.entries.length - 1]._id;
            await  attendance.save();
            // console.log("***Updated attendance entry is *** \n ", attendance);
            console.log("*** Updated attandance entry for user " + attendanceInfo.employee_code);
        }
    }


    return {
        "msg": "Entry Added success",
        "lastAction": attendance.lastAction,
        "status": attendance.status,
        "totalMinutesSpent": attendance.totalMinutesSpent
    };
}


const AttendanceModel = mongoose.model("attendance", attendanceSchema)
export default AttendanceModel
