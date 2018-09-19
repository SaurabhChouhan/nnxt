import {ObjectId, RequiredString, validDate} from './index'
import t from 'tcomb-validation'
import * as SC from '../serverconstants'

export const releaseTaskPlanningStruct = t.struct({
    _id: t.Nil,
    releasePlan: t.struct({
        _id: ObjectId
    }),
    employee: t.struct({
        _id: ObjectId
    }),
    release: t.struct({
        _id: ObjectId
    }),
    planning: t.struct({
        plannedHours: t.Number
    }),
    planningDate: RequiredString,
})

export const releaseTaskPlanningCommentStruct = t.struct({
    _id: t.Nil,
    releaseID: ObjectId,
    releasePlanID: ObjectId,
    comment: RequiredString,
    commentType: RequiredString,
})

export const releaseTaskReportStruct = t.struct({
    _id: ObjectId,
    reason: t.maybe(t.String),
    reportedHours: t.Number,
    status: t.enums.of([SC.REPORT_PENDING, SC.REPORT_COMPLETED]),
    reportedDate: validDate

})

export const releaseMergeTaskPlanningStruct = t.struct({
    _id: ObjectId,
    releasePlan: t.struct({
        _id: ObjectId
    }),
    release: t.struct({
        _id: ObjectId
    }),
    planning: t.struct({
        plannedHours: t.Number
    }),
    rePlanningDate: RequiredString
})

export const releaseTaskPlanningShiftStruct = t.struct({
    employeeId: ObjectId,
    daysToShift: t.Number,
    day: t.Number,
    month: t.Number,
    year: t.Number
})


export const releaseUpdateDatesStruct = t.struct({
    _id: ObjectId,
    updatedDevEndDate: validDate,
    updatedDevStartDate: validDate,
    updatedClientReleaseDate: validDate,
    iteration: t.struct({
        _id: ObjectId
    })
})

export const releaseUpdateStruct = t.struct({
    _id: ObjectId
})

export const plannedReleasePlanAddStruct = t.struct({
    name: RequiredString,
    description: RequiredString,
    estimatedHours: t.Number,
    estimatedBilledHours: t.Number,
    release: t.struct({
        _id: ObjectId
    })
})

export const plannedReleasePlanUpdateStruct = t.struct({
    _id: ObjectId,
    name: RequiredString,
    description: RequiredString,
    estimatedHours: t.Number,
    estimatedBilledHours: t.Number
})

export const unplannedReleasePlanAddStruct = t.struct({
    name: RequiredString,
    description: RequiredString,
    release: t.struct({
        _id: ObjectId
    })
})