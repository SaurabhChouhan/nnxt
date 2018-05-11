import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'

moment.locale('en')
momentLocalizer()
let ReleaseDeveloperFilterForm = (props) => {
    const {change, days, team, handleSubmit, employeeId, startDate, endDate, releasePlan} = props
    const startDateMoment = moment(startDate)
    const endDateMoment = moment(endDate)

    return <form onSubmit={handleSubmit}>
<div className="col-md-12 planFilterDivider">
        <div className="col-md-4 ">
            <Field name="employeeId" placeholder={"Name of Developer"}
                   onChange={(event, newValue, oldValue) => {
                       props.getDeveloperDetails(newValue, startDate, endDate)
                   }}
                   component={renderSelect} options={team}
                   label={"Developer Name:"}/>

        </div>
        <div className="col-md-8">
            <div className="col-md-6">
                <Field name="startDate" placeholder={"Start Date"} component={renderDateTimePickerString}
                       onChange={(event, newValue, oldValue) => {
                           props.getDeveloperDetails(employeeId, newValue, endDate)
                       }}
                       showTime={false}
                       min={new Date()}
                       max={endDateMoment}
                       label={" From :"}/>
            </div>
            <div className="col-md-6">
                <Field name="endDate" placeholder={" End Date"} component={renderDateTimePickerString}
                       onChange={(event, newValue, oldValue) => {
                           props.getDeveloperDetails(employeeId, startDate, newValue)
                       }}
                       showTime={false}
                       min={startDateMoment}
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
        const {employeeId, startDate, endDate, baseDate, daysToShift} = selector(state, 'employeeId', 'startDate', 'endDate', 'baseDate', 'daysToShift')
        return {
            employeeId,
            startDate,
            endDate,
            baseDate,
            daysToShift
        }
    }
)(ReleaseDeveloperFilterForm)


export default ReleaseDeveloperFilterForm