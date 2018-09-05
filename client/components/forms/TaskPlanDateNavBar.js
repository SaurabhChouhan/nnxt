import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import * as U from '../../../server/utils'
import momentTZ from "moment-timezone";
import {DATE_FORMAT} from "../../../server/serverconstants";

moment.locale('en')
momentLocalizer()


let TaskPlanDateNavBar = (props) => {
    const {handleSubmit, startDate, devStartDate, devEndDate, endDate, releaseID, pristine, submitting} = props
    let releaseStartMoment = moment(momentTZ.utc(devStartDate).format(DATE_FORMAT))
    let releaseEndMoment = moment(momentTZ.utc(devEndDate).format(DATE_FORMAT))
    let filterStartMoment = startDate ? moment(startDate) : undefined
    let filterEndMoment = endDate ? moment(endDate) : undefined


    let maxStartMoment = filterEndMoment && filterEndMoment.isValid() ? filterEndMoment : releaseEndMoment
    let minEndMoment = filterStartMoment && filterStartMoment.isValid() ? filterStartMoment : releaseStartMoment

    console.log("TaskPlanNavBar ", {
        releaseStartMoment,
        releaseEndMoment,
        filterStartMoment,
        filterEndMoment,
        maxStartMoment,
        minEndMoment,
        startDate,
        endDate,
        releaseID
    })

    return <form onSubmit={handleSubmit}>
        <div className="col-md-12 planFilterTaskForm">
            <div className="col-md-8">
                <div className="col-md-6">
                    <Field name="startDate"
                           placeholder={"Start Date"}
                           component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {
                               console.log("onChange() ", releaseID, startDate)
                               props.fetchTasks({
                                   releaseID,
                                   startDate: newValue,
                                   endDate
                               })

                           }}
                           showTime={false}
                           min={releaseStartMoment.toDate()}
                           max={maxStartMoment.toDate()}
                           label={" Start Date:"}/>
                </div>
                <div className="col-md-6">
                    <Field name="endDate" placeholder={" End Date"} component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {
                               props.fetchTasks({
                                   releaseID,
                                   startDate,
                                   endDate: newValue
                               })
                           }}
                           showTime={false}
                           min={minEndMoment.toDate()}
                           max={releaseEndMoment.toDate()}
                           label={" End Date:"}/>
                </div>

            </div>
            <div className="col-md-4 search-btn-taskplan-list">
                <button type="submit" className="col-md-4 btn customBtn" disabled={pristine || submitting}>Search
                </button>

            </div>
        </div>
    </form>
}

TaskPlanDateNavBar = reduxForm({
    form: 'task-filter'
})(TaskPlanDateNavBar)

const selector = formValueSelector('task-filter')

TaskPlanDateNavBar = connect(
    state => {
        const {releaseId, startDate, endDate} = selector(state, 'releaseId', 'startDate', 'endDate')
        return {
            releaseId,
            startDate,
            endDate
        }
    }
)(TaskPlanDateNavBar)


export default TaskPlanDateNavBar