import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText} from './fields'
import {number, required} from "./validation"
import * as logger from '../../clientLogger'


let AttendenceSettingForm = (props) => {

    return <div className="col-md-8">
        <div className="col-md-12 pad">
            <div className="col-md-12">
                <form onSubmit={props.handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Field name="minFullDayHours" placeholder={"minimum full day hours"}
                                   component={renderText} validate={[required, number]}
                                   label={"minimum full day hours:"}/>

                            <Field name="minHalfDayHours" placeholder={"minimum half day hours"}
                                   component={renderText} validate={[required, number]}
                                   label={"minimum full day hours:"}/>

                            <Field name="dayStartTime" placeholder={"day start Time"} component={renderText}
                                   label={"Day Start Time:"} validate={[required, number]}/>

                            <Field name="dayEndTime" placeholder={"day end Time"} component={renderText} validate={[required, number]}
                                   label={"Day End Time:"}/>

                            <button type="submit" className="btn customBtn">Submit</button>


                        </div>
                    </div>

                </form>
            </div>
        </div>

    </div>
}

AttendenceSettingForm = reduxForm({
    form: 'attendence-setting'
})(AttendenceSettingForm)

export default AttendenceSettingForm