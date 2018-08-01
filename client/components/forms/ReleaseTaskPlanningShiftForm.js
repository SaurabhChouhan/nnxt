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
let ReleaseTaskPlanningShiftForm = (props) => {
    const {day, month, handleSubmit, employee, daysToShift, year, days, release} = props

    //let m =

    let m = moment()
    m.date(day)
    m.month(month)
    m.year(year)

    return <form onSubmit={handleSubmit}>
        <div className={"row"}>
            <div className={"col-md-4"}>
                <span>From Date: <span className={"highlightText"}>{m.format('Do, MMM, YY')}</span></span>
            </div>
            <div className={"col-md-offset-4 col-md-4"}>
                <span>Employee: <span className={"highlightText"}>{employee.name}</span></span>
            </div>
        </div>
        <div className={"row"}>
            <div className="col-md-12 planDivider">
                <div className="col-md-offset-8 col-md-4"><span>Days to Shift</span>
                    <Field name="daysToShift" placeholder={"select days"}
                           displayField={"day"}
                           valueField={"day"}
                           component={renderSelect} options={days}
                    />
                </div>
            </div>
        </div>
        <div className={"row"}>
            <div className="col-md-offset-4 col-md-8">
                <div style={{float: "right"}}>
                    <button
                        type="button"
                        className="btn customBtn Past "
                        onClick={() => {
                            props.shiftTasksToPast(release._id, employee._id, day, month, year, daysToShift)
                        }}><span className="glyphicon glyphicon-chevron-left"></span>
                        Shift in Past
                    </button>
                    <button
                        type="button"
                        className="btn customBtn Future"
                        onClick={() => {
                            props.shiftTasksToFuture(release._id, employee._id, day, month, year, daysToShift)
                        }}>
                        Shift in Future
                        <span className="glyphicon glyphicon-chevron-right"></span>
                    </button>
                </div>
            </div>
        </div>
    </form>
}

ReleaseTaskPlanningShiftForm = reduxForm({
    form: 'task-plan-shift'
})(ReleaseTaskPlanningShiftForm)

const selector = formValueSelector('task-plan-shift')

ReleaseTaskPlanningShiftForm = connect(
    state => {
        const {employee, month, day, year, daysToShift} = selector(state, 'employee', 'month', 'day', 'year', 'daysToShift', 'release')
        return {
            employee,
            month,
            day,
            year,
            daysToShift
        }
    }
)(ReleaseTaskPlanningShiftForm)


export default ReleaseTaskPlanningShiftForm