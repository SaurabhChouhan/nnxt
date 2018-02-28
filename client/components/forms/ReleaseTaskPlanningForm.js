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
                           let employee = team.find(e => e._id == newValue)
                           change("employee.name",employee.name)
                       }}
                       component={renderSelect} options={team}
                       label={"Developer Name:"} validate={[required]}/>

                <div className="col-md-12">
                    <button type="submit" className="btn customBtn">Save To Local</button>
                    <button type="button" className="btn customBtn" onClick={reset}>Reset</button>
                </div>
            </div>
        </div>

    </form>
}

ReleaseTaskPlanningForm = reduxForm({
    form: 'task-planning'
})(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningForm