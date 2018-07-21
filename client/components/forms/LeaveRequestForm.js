import {required} from "./validation"
import {renderDateTimePickerString, renderSelect, renderTextArea} from "./fields"
import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'
import {connect} from 'react-redux'
import _ from 'lodash'


moment.locale('en')
momentLocalizer()

let LeaveRequestForm = (props) => {
    const {pristine, submitting, reset, handleSubmit, startDate, endDate} = props
    let now = new Date()
    const startDateMoment = startDate && !_.isEmpty(startDate) ? U.momentInTimeZone(startDate, SC.INDIAN_TIMEZONE) : undefined
    const endDateMoment = endDate && !_.isEmpty(endDate) ? U.momentInTimeZone(endDate, SC.INDIAN_TIMEZONE) : undefined
    const startDateMomentDate = startDateMoment && startDateMoment.isValid() ? startDateMoment.toDate() : undefined
    const endDateMomentDate = endDateMoment && endDateMoment.isValid() ? endDateMoment.toDate() : undefined

    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="_id" component="input" type="hidden"/>
                <Field name="dayType" placeholder={"Leave day"} displayField={"name"} valueField={"name"}
                       component={renderSelect} options={SC.LEAVE_TYPE_DAY_WITH_NAME_ARRAY}
                       label={"Day type :"} validate={[required]}/>

                <Field name="startDate" placeholder={"Leave Start Date :"} component={renderDateTimePickerString}
                       showTime={false}
                       label={"Start Date :"}
                       min={now}
                       max={endDateMomentDate}
                       validate={[required]}/>

                <Field name="endDate" placeholder={"Leave End Date :"} component={renderDateTimePickerString}
                       showTime={false}
                       min={startDateMomentDate ? startDateMomentDate : now}
                       label={"End Date :"}
                       validate={[required]}/>

                <Field name="leaveType._id" placeholder={"type of leave"} displayField={"name"} valueField={"_id"}
                       component={renderSelect} options={props.leaveTypes}
                       label={"Type :"} validate={[required]}/>

                <Field width="80%" name="description" validate={[required]} component={renderTextArea}
                       label="Description:"/>

                <button type="submit" disabled={pristine || submitting} className="btn customBtn"> Submit</button>
            </div>

        </div>

    </form>
}

LeaveRequestForm = reduxForm({
    form: 'leave-request'

})(LeaveRequestForm)
const selector = formValueSelector('leave-request')

LeaveRequestForm = connect(
    state => {
        const {startDate, endDate} = selector(state, 'startDate', 'endDate')
        return {
            startDate,
            endDate,
        }
    }
)(LeaveRequestForm)

export default LeaveRequestForm