import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import * as U from '../../../server/utils'

import * as SC from '../../../server/serverconstants'
import momentTZ from "moment-timezone";
import {DATE_FORMAT} from "../../../server/serverconstants";
import {required} from "./validation";

moment.locale('en')
momentLocalizer()


let TaskPlanDateNavBar = (props) => {
    const {handleSubmit, startDate, devStartDate, devEndDate, endDate, releaseID, pristine, submitting, status, flag} = props
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
                                   endDate,
                                   status,
                                   flag
                               })

                           }}
                           showTime={false}
                           min={releaseStartMoment.toDate()}
                           max={maxStartMoment.toDate()}
                           label={" Start Date :"}/>
                </div>
                <div className="col-md-6">
                    <Field name="endDate" placeholder={" End Date"} component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {
                               props.fetchTasks({
                                   releaseID,
                                   startDate,
                                   endDate: newValue,
                                   status,
                                   flag
                               })
                           }}
                           showTime={false}
                           min={minEndMoment.toDate()}
                           max={releaseEndMoment.toDate()}
                           label={" End Date :"}/>
                </div>

            </div>

            <div className="col-md-2">

                <Field name="status" component={renderSelect} label={"Status"} options={
                    SC.ALL_TASK_STATUS.map((status, idx) =>
                        ({
                            _id: status,
                            name: status
                        })
                    )
                } onChange={(event, newValue) => {
                           props.fetchTasks({
                               releaseID,
                               startDate,
                               endDate,
                               status: newValue,
                               flag
                           })
                       }} noneOptionText = 'All'/>
            </div>
            <div className="col-md-2">
                <Field name="flag" component={renderSelect} label={"Flag"} options={
                    SC.ALL_WARNING_NAME_ARRAY.map((status, idx) =>
                        ({
                            _id: status,
                            name: status
                        })
                    )
                } onChange={(event, newValue, oldValue) => {
                           props.fetchTasks({
                               releaseID,
                               startDate,
                               endDate,
                               status,
                               flag: newValue
                           })
                       }} noneOptionText = 'All'/>
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
        const {releaseId, startDate, endDate, status, flag} = selector(state, 'releaseId', 'startDate', 'endDate', 'status', 'flag')
        return {
            releaseId,
            startDate,
            endDate,
            status,
            flag
        }
    }
)(TaskPlanDateNavBar)


export default TaskPlanDateNavBar