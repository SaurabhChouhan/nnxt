import {required} from "./validation"
import {renderDateTimePickerString, renderSelect, renderTextArea} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()

let LeaveRequestForm = (props) => {
    const {pristine, submitting, reset, handleSubmit} = props
    let now = new Date()
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
                       validate={[required]}/>

                <Field name="endDate" placeholder={"Leave End Date :"} component={renderDateTimePickerString}
                       showTime={false}
                       min={now}

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

export default LeaveRequestForm