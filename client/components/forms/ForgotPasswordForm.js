import {Field, Form, reduxForm} from 'redux-form'
import React from 'react'
import {email, number, passwordLength, required} from './validation'
import {renderLoginField, renderText, renderField } from "./fields"
import {Link} from 'react-router-dom'

let ForgotPasswordForm = (props) => {
    const passwordMatch = (value, values) => {
        return (value != values.password) ? `both password field should be same ` : undefined
    }
    const {handleSubmit, errorMsg} = props
    return <div>
        <div className="col-md-12 loginsection">
            <div className="col-md-5 login_img ">
                <h1>WELCOME TO</h1>
                <p>This application allows a company to manage complete life cycle of their projects. </p>
                <ul className={"descriptionList"}>
                    <li>Project Estimations</li>
                    <li>Release Management</li>
                    <li>Task Management</li>
                    <li>Resource Management</li>
                    <li>Leave Management</li>
                    <li>Post Release Analysis</li>
                </ul>
            </div>
            <div className="col-md-7 loginform">
                <header>FORGOT PASSWORD <span><b>NNXT</b></span></header>
                <Form onSubmit={handleSubmit}>
                    {errorMsg &&
                    <div style={{width: "100%", textAlign: "center"}}>
                        <span className="validation-error"
                              style={{fontSize: '20px'}}>{errorMsg}</span>
                    </div>}
                    {props.forgotPasswordRequestInfo && props.forgotPasswordRequestInfo.forgotPasswordRequestStatus == true ?
                        [<Field name="email" component={renderLoginField} type="hidden"/>,
                            <Field name="otp" label={"OTP :"} placeholder={"Enter OTP"}
                                   component={renderText} validate={[required]}/>,
                            <Field name="password" label={"New Password :"} placeholder={"new Password"}
                                   validate={[passwordLength]}
                                   component={renderText} type="password"/>,
                            <Field name="confirmPassword" label="Confirm Password :"
                                   placeholder={"confirm Password"}
                                   validate={[passwordLength, passwordMatch]} component={renderField}
                                   type="password"/>
                        ]
                        :
                        <Field name="email" component={renderLoginField} label="Email :"
                               validate={[required, email]}/>
                    }

                    <div className="col-md-12">
                        <span className="pull-right"> <Link to="/login"><u>Already Registered! Login Here?</u></Link><br/></span>
                    </div>

                    <div className="col-md-12">
                        <button type="submit" className="btn  login-btn">Submit
                        </button>
                    </div>

                    <footer className="text-center">  &copy; Copyright all rights reserved. <strong> Aripra Infotech Pvt
                        Ltd</strong></footer>
                </Form>

            </div>
        </div>

    </div>
}

ForgotPasswordForm = reduxForm({
    form: "ForgotPasswordForm"
})(ForgotPasswordForm)

export default ForgotPasswordForm