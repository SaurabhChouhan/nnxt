import {ObjectId, RequiredString} from "./index";
import t from 'tcomb-validation';
import * as SC from '../serverconstants';

export const employeeAddEmployeeDaysStruct = t.struct({
    _id: t.Nil,
    employee: t.struct({
        _id: ObjectId,
        name: t.String
    }),
    plannedHours: t.Number,
    dateString: RequiredString,
});

export const employeeUpdateEmployeeDaysStruct = t.struct({
    plannedHours: t.Number,
    dateString: RequiredString,
    employee: t.struct({
        _id: ObjectId,
        name: t.String
    })
});

export const employeeCreateSettingStruct = t.struct({
    _id: t.Nil,
    maxPlannedHours: t.Number,
    minPlannedHours: t.Number,
    free: t.Number,
    relativelyFree: t.Number,
    busy: t.Number,
    superBusy: t.Number

});
export const employeeUpdateSettingStruct = t.struct({
    _id: ObjectId,
    maxPlannedHours: t.Number,
    minPlannedHours: t.Number,
    free: t.Number,
    relativelyFree: t.Number,
    busy: t.Number,
    superBusy: t.Number

});

export const employeeAddEmployeeStatisticsStruct = t.struct({
    _id: t.Nil,
    employee: t.struct({
        _id: ObjectId,
        name: t.String
    }),
    leaves: t.maybe(t.list(
        t.struct({
            _id: ObjectId,
            date: t.String,
            reason: t.String,
            plannedHours: t.Number
        })
    )),
    tasks: t.maybe(t.list(
        t.struct({
            _id: ObjectId,
            name: t.String,
            plannedHours: t.Number,
            reportedHours: t.Number,
            plannedHoursReportedTasks: t.Number
        })
    ))
});

export const employeeAddTaskEmployeeStatisticsStruct = t.struct({
    release: t.struct({
        _id: ObjectId
    }),
    employee: t.struct({
        _id: ObjectId
    }),
    task: t.struct({
        _id: ObjectId,
        name: t.String,
        plannedHours: t.Number,
        reportedHours: t.Number,
        plannedHoursReportedTasks: t.Number
    })

});

export const employeeUpdateTaskEmployeeStatisticsStruct = t.struct({
    release: t.struct({
        _id: ObjectId
    }),
    employee: t.struct({
        _id: ObjectId
    }),
    task: t.struct({
        _id: ObjectId,
        plannedHours: t.Number,
        reportedHours: t.Number,
        plannedHoursReportedTasks: t.Number
    })

});
