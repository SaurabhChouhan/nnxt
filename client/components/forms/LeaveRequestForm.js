import {required} from "./validation"
import {renderDateTimePicker, renderDateTimePickerString, renderSelect, renderText, renderTextArea} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
moment.locale('en')
momentLocalizer()
import * as logger from "../../clientLogger";

let LeaveRequestForm = (props) => {

    console.log("You are leave request Form", props.leaveTypes.name)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="user.user._id" component="input" type="hidden"/>
                <Field name="user.user.firstName" component="input" type="hidden"/>
                <Field name="user.user.lastName" component="input" type="hidden"/>

                <Field name="dayType" placeholder={"Leave day"} displayField={"name"} valueField={"name"} component={renderSelect} options={[{name:"Full"},{name:"Half"}]}
                       label={"Day type :"} validate={[required]}/>

                <Field name="startDate" placeholder={"Leave Start Date :"} component={renderDateTimePicker}
                       min={moment()} showTime={false}
                       label={"Start Date :"} validate={[required]}/>

                <Field name="endDate" placeholder={"Leave End Date :"} component={renderDateTimePicker}
                       min={moment()} showTime={false}
                       label={"End Date :"} validate={[required]}/>

                <Field name="leaveType._id" placeholder={"type of leave"} displayField={"name"} valueField={"_id"} component={renderSelect} options={props.leaveTypes}
                       label={"Type :"} validate={[required]}/>

                <Field width="80%" name="description" validate={[required]} component={renderTextArea}
                       label="Description:"/>

                <button type="submit" className="btn customBtn"> Submit</button>
            </div>

        </div>

    </form>
}

LeaveRequestForm = reduxForm({
    form: 'leave-request'

})(LeaveRequestForm)

export default LeaveRequestForm