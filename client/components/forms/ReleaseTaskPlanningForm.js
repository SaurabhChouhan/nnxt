import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText,renderDateTimePicker,renderSelect} from './fields'
import {required} from "./validation"
import * as logger from '../../clientLogger'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
moment.locale('en')
momentLocalizer()
const now = new date();
let ReleaseTaskPlanningForm = (props) => {
    console.log("inside task form ",props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">

                <Field name="planningDate" placeholder={"Date"} component={renderDateTimePicker}
                       min={moment(now)} showTime={false}
                       label={" Date :"} validate={[required]}/>
                <Field name="planning.plannedHours" placeholder={"Enter Hours"} component={renderText}
                       label={"Estimated Hours:"} validate={[required]}/>
                <Field name="employee._id" placeholder={"Name of Developer"} component={renderSelect} options={props.team}
                       label={"Developer Name:"} validate={[required]}/>

                <button type="submit" className="btn customBtn">Submit</button>
            </div>
        </div>

    </form>
}

ReleaseTaskPlanningForm = reduxForm({
    form: 'task-planning'
})(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningForm