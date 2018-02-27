import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText,renderDateTimePicker,renderSelect} from './fields'
import {required,number} from "./validation"
import * as logger from '../../clientLogger'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
moment.locale('en')
momentLocalizer()
let ReleaseTaskPlanningForm = (props) => {
    const { change} = props
    console.log("inside task form ",props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">

                <Field name="release._id" component="input" type="hidden"/>

                <Field name="planningDate" placeholder={"Date"} component={renderDateTimePicker}
                       showTime={false}
                       label={" Date :"} validate={[required]}/>
                <Field name="planning.plannedHours" placeholder={"Enter Hours"} component={renderText}
                       label={"Estimated Hours:"} validate={[required,number]}/>

                <Field name="employee.name" component="input" type="hidden"/>
                <Field name="employee._id" placeholder={"Name of Developer"}
                       onChange={(event, newValue, oldValue) =>
                       {
                           let employee = props.team.find(e=>e._id == newValue)
                           change("employee.name",employee.name)
                       }}
                       component={renderSelect} options={props.team}
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