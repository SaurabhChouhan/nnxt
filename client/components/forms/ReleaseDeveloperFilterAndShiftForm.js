import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePicker, renderSelect,} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'

moment.locale('en')
momentLocalizer()
let ReleaseDeveloperFilterForm = (props) => {
    const {change, days, team, handleSubmit, employeeId, startDate, endDate} = props

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
            <div className="col-md-3 planDividerDate"><span>Days to Shift</span>
                <Field name="employeeId" placeholder={"select days"}
                       displayField={"day"}
                       valueField={"day"}
                       onChange={(event, newValue, oldValue) => {
                           // props.getDeveloperDetails(newValue, startDate, endDate)
                       }}
                       component={renderSelect} options={days}
                />
            </div>
            <div className="col-md-6 planDividerBtn">

                <button className="btn customBtn Past ">
                    Shift in Past
                </button>
                <button className="btn customBtn Future">
                    Shift in Future
                </button>

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
        const {employeeId, startDate, endDate} = selector(state, 'employeeId', 'startDate', 'endDate')
        return {
            employeeId,
            startDate,
            endDate
        }
    }
)(ReleaseDeveloperFilterForm)


export default ReleaseDeveloperFilterForm