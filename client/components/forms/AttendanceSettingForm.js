import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText} from './fields'
import {number, required} from "./validation"


let AttendanceSettingForm = (props) => {
    const {handleSubmit, pristine, reset, submitting} = props;

    return <div className="col-md-8">
        <div className="col-md-12 pad">
            <div className="col-md-12">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Field name="minFullDayHours" placeholder={"minimum full day hours"}
                                   component={renderText} validate={[required, number]}
                                   label={"Minimum Full Day Hours :"}/>

                            <Field name="minHalfDayHours" placeholder={"minimum half day hours"}
                                   component={renderText} validate={[required, number]}
                                   label={"Minimum Half Day Hours :"}/>

                            <Field name="dayStartTime" placeholder={"day start Time"} component={renderText}
                                   label={"Day Start Time :"} validate={[required, number]}/>

                            <Field name="dayEndTime" placeholder={"day end Time"} component={renderText}
                                   validate={[required, number]}
                                   label={"Day End Time :"}/>

                            <button type="submit" disabled={pristine || submitting}
                                    className="btn customBtn moveInBtnSpace">Submit
                            </button>

                            <button type="button" disabled={pristine || submitting} className="btn customBtn"
                                    onClick={reset}>Reset
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>

    </div>
}

AttendanceSettingForm = reduxForm({
    form: 'attendance-setting'
})(AttendanceSettingForm)

export default AttendanceSettingForm