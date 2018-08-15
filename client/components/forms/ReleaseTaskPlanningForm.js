import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderCheckBox, renderDateTimePickerString, renderSelect, renderText, renderTextArea} from './fields'
import {number, required} from "./validation"
import {connect} from 'react-redux'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()
let ReleaseTaskPlanningForm = (props) => {
    const {change, handleSubmit, submitting, pristine, reset} = props
    const {allTeam, releaseTeam, releasePlan, projectUsersOnly, initial} = props
    const today = new Date()
    const todayMoment = moment(today).hour(0).minute(0).second(0).milliseconds(0)
    const devStartDateMoment = moment(initial.devStartDate).hour(0).minute(0).second(0).milliseconds(0)
    const devEndDateMoment = moment(initial.devEndDate).hour(0).minute(0).second(0).milliseconds(0)
    const min = devStartDateMoment.isSameOrAfter(todayMoment) ? devStartDateMoment.toDate() : todayMoment.toDate()
    const max = devEndDateMoment.toDate()

    let employees = []
    if (releasePlan && releasePlan.rolesInThisRelease) {
        if (releasePlan.rolesInThisRelease.indexOf(SC.ROLE_MANAGER) > -1)
            employees = projectUsersOnly ? releaseTeam : allTeam
        else if (releasePlan.rolesInThisRelease.indexOf(SC.ROLE_LEADER) > -1)
            employees = releaseTeam
    }

    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6 releaseAlign">

                <Field name="release._id" component="input" type="hidden"/>

                <Field name="planningDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}
                       min={min}
                       max={max}
                       label={" Date :"} validate={[required]}/>
                <Field name="planning.plannedHours"
                       placeholder={"Enter Hours"}
                       component={renderSelect}
                       label={"Planning Hours:"}
                       validate={[required, number]}
                       options={
                           [{'name': '0.5'}, {'name': '1'}, {'name': '1.5'}, {'name': '2'}, {'name': '2.5'}, {'name': '3'}, {'name': '3.5'},
                               {'name': '4'}, {'name': '4.5'}, {'name': '5'}, {'name': '5.5'}, {'name': '6'}, {'name': '6.5'}, {'name': '7'},
                               {'name': '7.5'}, {'name': '8'}, {'name': '8.5'}, {'name': '9'}, {'name': '9.5'}, {'name': '10'}, {'name': '10.5'}
                               ,{'name': '11'}, {'name': '11.5'}, {'name': '12'}]}
                       valueField={"name"}
                />

                <Field name="employee.name" component="input" type="hidden"/>
                {
                    releasePlan && releasePlan.rolesInThisRelease.indexOf(SC.ROLE_MANAGER) > -1 ?
                        <Field name="projectUsersOnly"
                               type="checkbox"
                               label="projectUsersOnly"
                               className="input checkbox planchk "
                               component={renderCheckBox}/> : null
                }

                <Field name="employee._id" placeholder={"Name of Developer"}
                       component={renderSelect}
                       options={employees}
                       label={"Developer Name:"}
                       onChange={(event, newValue, oldValue) => {
                           let employee = allTeam.find(e => e._id == newValue)
                           change("employee.name", employee.name)
                       }}
                       validate={[required]}/>

                <div className="planTextArea">
                    <Field name="description"
                           label={"Description:"}
                           component={renderTextArea}
                           type="text"
                           rows={8}
                           placeholder="Enter task description"
                           validate={[required]}/>
                </div>

            </div>

            <div className="col-md-12 releaseAlign">
                <div className="col-md-4 releasePlanBtn">
                    <button type="submit" className="btn customBtn " disabled={submitting || pristine}>Plan Task
                    </button>
                </div>
                <div className="col-md-4 releaseResetBtn">
                    <button type="button" className="btn customBtn" disabled={submitting || pristine} onClick={reset}>
                        Reset
                    </button>
                </div>
            </div>

        </div>

    </form>
}

ReleaseTaskPlanningForm = reduxForm({
    form: 'task-planning'
})(ReleaseTaskPlanningForm)

const selector = formValueSelector('task-planning')

ReleaseTaskPlanningForm = connect(
    state => {
        const projectUsersOnly = selector(state, 'projectUsersOnly')
        return {
            projectUsersOnly
        }
    }
)(ReleaseTaskPlanningForm)


export default ReleaseTaskPlanningForm