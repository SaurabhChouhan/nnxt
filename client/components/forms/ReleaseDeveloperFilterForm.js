import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDateTimePicker, renderSelect, renderText} from './fields'
import {number, required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

moment.locale('en')
momentLocalizer()
let ReleaseTaskPlanningForm = (props) => {
    const {change, team, handleSubmit, reset} = props

    return <form onSubmit={handleSubmit}>

        <div className="col-md-4">
            <Field name="employee._id" placeholder={"Name of Developer"}
                   onChange={(event, newValue, oldValue) =>
                   {
                       this.props.getDeveloperDetails(newValue,"","")
                   }}
                   component={renderSelect} options={team}
                   label={"Developer Name:"} />

        </div>
        <div className="col-md-8">
            <div className="col-md-6">
                <Field name="planningDate" placeholder={"Date"} component={renderDateTimePicker}
                       showTime={false}
                       label={" From :"} />
            </div>
            <div className="col-md-6">
                <Field name="planningDate" placeholder={"Date"} component={renderDateTimePicker}
                       showTime={false}
                       label={" To :"}/>
            </div>

        </div>
    </form>
}

ReleaseTaskPlanningForm = reduxForm({
    form: 'task-planning'
})(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningForm