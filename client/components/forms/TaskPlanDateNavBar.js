import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from 'lodash'
import * as U from '../../../server/utils'

moment.locale('en')
momentLocalizer()
let TaskPlanDateNavBar = (props) => {
    const {handleSubmit, startDate, endDate,pristine, submitting} = props
    let min = startDate && U.nowMomentInIndia().isSameOrBefore(U.momentInUTC(startDate)) ? U.momentInUTC(startDate) : U.nowMomentInIndia()
    console.log("min", min)

    return <form onSubmit={handleSubmit}>
        <div className="col-md-12 planFilterTaskForm">
            <div className="col-md-8">
                <div className="col-md-6">
                    <Field name="startDate"
                           placeholder={"Start Date"}
                           component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {

                           }}
                           showTime={false}
                           min={min ? min.toDate() : min}
                           label={" Start Date :"}/>
                </div>
                <div className="col-md-6">
                    <Field name="endDate" placeholder={" End Date"} component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {
                               //props.getEmployeePlanDetails(employeeId, startDate, newValue, selectedReleaseID)
                           }}
                           showTime={false}
                           min={min ? min.toDate() : min}
                           label={" End Date :"}/>
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