import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePicker, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'

moment.locale('en')
momentLocalizer()
let ReleaseDeveloperFilterForm = (props) => {
    const {change, days, team, handleSubmit, employeeId, startDate, endDate, baseDate, daysToShift} = props

    return <form onSubmit={handleSubmit}>
        <div className="col-md-12 planDivider">
            <div className="col-md-3 planDividerDate"><span>Base Date</span>
                <Field name="baseDate" placeholder={"select base date"} component={renderDateTimePicker}
                       onChange={(event, newValue, oldValue) => {
                           // props.getDeveloperDetails(employeeId, startDate, newValue)
                       }}
                       showTime={false}
                       min={new Date()}
                />
            </div>
            <div className="col-md-2 planDividerDate"><span>Days to Shift</span>
                <Field name="daysToShift" placeholder={"select days"}
                       displayField={"day"}
                       valueField={"day"}
                       onChange={(event, newValue, oldValue) => {
                           // props.getDeveloperDetails(newValue, startDate, endDate)
                       }}
                       component={renderSelect} options={days}
                />
            </div>
            <div className="col-md-7 planDividerBtn">
                <div className="col-md-6">
                <i className="glyphicon glyphicon-arrow-left pastArrow"></i>
                <button
                    type="button"
                    className="btn customBtn Past"
                    onClick={() => {
                        props.shiftTasksToPast(baseDate, daysToShift)
                    }}>
                    Shift in Past
                </button></div>
                <div className="col-md-6">
                <button
                    type="button"
                    className="btn customBtn Future"
                    onClick={() => {
                        props.shiftTasksToFuture(baseDate, daysToShift)
                    }}>
                    Shift in Future
                </button>
                    <i className="glyphicon glyphicon-arrow-right futureArrow"></i></div>
            </div>
        </div>

        <div className="col-md-4">
            <Field name="employeeId" placeholder={"Name of Developer"}
                   onChange={(event, newValue, oldValue) => {
                       props.getDeveloperDetails(newValue, startDate, endDate)
                   }}
                   component={renderSelect} options={team}
                   label={"Developer Name:"}/>

        </div>
        <div className="col-md-6">
            <div className="col-md-6">
                <Field name="startDate" placeholder={"Start Date"} component={renderDateTimePicker}
                       onChange={(event, newValue, oldValue) => {
                           props.getDeveloperDetails(employeeId, newValue, endDate)
                       }}
                       showTime={false}
                       min={new Date()}
                       max={endDate}
                       label={" From :"}/>
            </div>
            <div className="col-md-6">
                <Field name="endDate" placeholder={" End Date"} component={renderDateTimePicker}
                       onChange={(event, newValue, oldValue) => {
                           props.getDeveloperDetails(employeeId, startDate, newValue)
                       }}
                       showTime={false}
                       min={startDate}
                       label={" To :"}/>
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