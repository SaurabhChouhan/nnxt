import React, {Component} from 'react'
import {formValueSelector, reduxForm} from 'redux-form'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'

moment.locale('en')
momentLocalizer()
let ReleaseTaskPlanningShiftForm = (props) => {
    const {change, team, handleSubmit, employeeId, startDate, endDate} = props

    return <form onSubmit={handleSubmit}>
        <div className="col-md-12 planDivider">
            <div className="col-md-2 planDividerDate"><span>Base Date</span><input type="text"
                                                                                   className="form-control"
                                                                                   placeholder="Date"/>
            </div>
            <div className="col-md-2 planDividerDate"><span>Days to Shift</span>
                <select className="form-control">
                    <option value="">01</option>
                    <option value="">02</option>
                    <option value="">03</option>
                    <option value="">04</option>
                </select>
            </div>
            <div className="col-md-8 planDividerBtn">
                <form>
                    <button className="btn customBtn Future">
                        Shift in Future
                    </button>
                    <button className="btn customBtn Past ">
                        Shift in Past
                    </button>
                </form>
            </div>
        </div>

    </form>
}

ReleaseTaskPlanningShiftForm = reduxForm({
    form: 'shift-form'
})(ReleaseTaskPlanningShiftForm)

const selector = formValueSelector('shift-form')

ReleaseTaskPlanningShiftForm = connect(
    state => {
        const {employeeId, startDate, endDate} = selector(state, 'employeeId', 'startDate', 'endDate')
        return {
            employeeId,
            startDate,
            endDate
        }
    }
)(ReleaseTaskPlanningShiftForm)


export default ReleaseTaskPlanningShiftForm