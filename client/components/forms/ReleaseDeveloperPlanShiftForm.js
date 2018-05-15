import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import momentTZ from 'moment-timezone'
import {connect} from 'react-redux'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()
let ReleaseDeveloperPlanShiftForm = (props) => {
    const {days, team, handleSubmit, employeeId, startDate, endDate, baseDate, daysToShift, releasePlan} = props
    let now = new Date()
    let nowMoment = momentTZ.tz(now, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
    console.log("nowMoment in shift form", nowMoment)
    return <form onSubmit={handleSubmit}>
        <div className="col-md-12 planDivider">
            <div className="col-md-3 devMargin">
                <Field name="employeeId" placeholder={"Name of Developer"}
                       component={renderSelect} options={team}
                       label={"Developer Name:"}/>

            </div>
            <div className="col-md-3 planDividerDate devMargin"><span>Base Date</span>
                <Field name="baseDate" placeholder={"select base date"} component={renderDateTimePickerString}
                       showTime={false}
                       min={nowMoment}
                />
            </div>
            <div className="col-md-2 planDividerDate devMargin"><span>Days to Shift</span>
                <Field name="daysToShift" placeholder={"select days"}
                       displayField={"day"}
                       valueField={"day"}
                       component={renderSelect} options={days}
                />
            </div>
            <div className="col-md-4 planDividerBtn">
                <div className="col-md-6">
                    <button
                        type="button"
                        className="btn customBtn Past "
                        onClick={() => {
                            props.shiftTasksToPast(employeeId, baseDate, daysToShift, releasePlan._id)
                        }}><span className="glyphicon glyphicon-chevron-left"></span>
                        Shift in Past
                    </button>
                </div>
                <div className="col-md-6">
                    <button
                        type="button"
                        className="btn customBtn Future"
                        onClick={() => {
                            props.shiftTasksToFuture(employeeId, baseDate, daysToShift, releasePlan._id)
                        }}>
                        Shift in Future
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </button>
                    </div>
            </div>
        </div>


    </form>
}

ReleaseDeveloperPlanShiftForm = reduxForm({
    form: 'developer-plan-shift'
})(ReleaseDeveloperPlanShiftForm)

const selector = formValueSelector('developer-plan-shift')

ReleaseDeveloperPlanShiftForm = connect(
    state => {
        const {employeeId, baseDate, daysToShift} = selector(state, 'employeeId', 'baseDate', 'daysToShift')
        return {
            employeeId,
            baseDate,
            daysToShift
        }
    }
)(ReleaseDeveloperPlanShiftForm)


export default ReleaseDeveloperPlanShiftForm