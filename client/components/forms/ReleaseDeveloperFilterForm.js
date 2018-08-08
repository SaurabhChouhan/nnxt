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
let ReleaseDeveloperFilterForm = (props) => {
    const {team, handleSubmit, employeeId, startDate, endDate, selectedReleaseID} = props
    let min = startDate && U.nowMomentInIndia().isSameOrBefore(U.momentInUTC(startDate)) ? U.momentInUTC(startDate) : U.nowMomentInIndia()
    let max = U.momentInUTC(endDate)
    console.log("min", min)
    console.log("max", max)
    return <form onSubmit={handleSubmit}>
        <div className="col-md-12 planFilterDivider">
            <div className="col-md-4 ">
                <Field name="employeeId" placeholder={"Name of Developer"}
                       onChange={(event, newValue, oldValue) => {
                           props.getEmployeePlanDetails(newValue, startDate, endDate, selectedReleaseID)
                       }}
                       component={renderSelect} options={team}
                       label={"Developer Name:"}/>

            </div>
            <div className="col-md-8">
                <div className="col-md-6">
                    <Field name="startDate"
                           placeholder={"Start Date"}
                           component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {
                               props.getEmployeePlanDetails(employeeId, newValue, endDate, selectedReleaseID)
                           }}
                           showTime={false}
                           min={min ? min.toDate() : min}
                           max={max ? max.toDate() : max}
                           label={" From :"}/>
                </div>
                <div className="col-md-6">
                    <Field name="endDate" placeholder={" End Date"} component={renderDateTimePickerString}
                           onChange={(event, newValue, oldValue) => {
                               props.getEmployeePlanDetails(employeeId, startDate, newValue, selectedReleaseID)
                           }}
                           showTime={false}
                           min={min ? min.toDate() : min}
                           label={" To :"}/>
                </div>

            </div>
        </div>
    </form>
}

ReleaseDeveloperFilterForm = reduxForm({
    form: 'developer-filter'
})(ReleaseDeveloperFilterForm)

const selector = formValueSelector('developer-filter')

ReleaseDeveloperFilterForm = connect(
    state => {
        const {employeeId, startDate, endDate} = selector(state, 'employeeId', 'startDate', 'endDate')
        return {
            employeeId,
            startDate,
            endDate
        }
    }
)(ReleaseDeveloperFilterForm)


export default ReleaseDeveloperFilterForm