import {reduxForm, Field, Form} from 'redux-form'
import React from 'react'
import {required, email, passwordLength} from './validation'
import {renderText} from "./fields";

const passwordMatch = (value, values) => {
    //console.log("pm ", value, values)
    return (value != values.password) ? `Should match password value` : undefined
}
const emailMatch = (value, values) => {
    //console.log("pm ", value, values)
    return (value != values.email) ? `Should match email value` : undefined
}
let RegistrationForm = (props) => {
    const {pristine, submitting} = props;
    console.log("RegistrationForm->props ", props)
    return <div className="col-md-6"><Form onSubmit={props.handleSubmit}>
        <div className="" style={{background: '#E7E7E7'}}>
            <div className="modal-body">
                <div className="registrationDiv">
                    <Field name="firstName"
                           component={renderText}
                           label="First Name :"
                           validate={[required]}/>
                    <Field name="lastName"
                           component={renderText}
                           label="Last Name :"/>
                    <Field name="email"
                           component={renderText}
                           label="Email :"
                           validate={[required, email]}/>
                    <Field name="confirmEmail"
                           component={renderText}
                           label="Confirm Email :"
                           validate={[required, email, emailMatch]}/>
                    <Field style={{marginBottom: "7px"}}
                           name="password"
                           component={renderText}
                           type="password"
                           label="Password :"
                           validate={[required, passwordLength]}/>
                    <Field style={{marginBottom: "7px"}}
                           name="confirmPassword"
                           component={renderText}
                           type="password"
                           label="Confirm Password :"
                           validate={[required, passwordMatch, passwordLength]}/>
                </div>
            </div>
            <div className="modal-footer">
                <button type="submit" disabled={pristine || submitting} className="btn btn-custom">Register</button>
                <button type="submit" disabled={pristine || submitting} onClick={() => props.reset()}
                        className="btn btn-custom">Reset
                </button>
            </div>
        </div>
    </Form>
    </div>
}

RegistrationForm = reduxForm({
    form: "RegistrationForm"
})(RegistrationForm)

export default RegistrationForm