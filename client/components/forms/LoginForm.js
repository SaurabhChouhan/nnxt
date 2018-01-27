import {reduxForm, Field, Form} from 'redux-form'
import React from 'react'
import {required, email} from './validation'
import {renderLoginField} from "./fields";

let LoginForm = (props) => {
    console.log("loginForm->props ", props)
    return <Form onSubmit={props.handleSubmit}>
        <div className="" style={{background: '#E7E7E7'}}>
            <div className="modal-body">
                {props.errorMsg &&
                <div style={{width: "100%", textAlign: "center"}}><span className="validation-error"
                                                                        style={{fontSize: '20px'}}>{props.errorMsg}</span>
                </div>}
                <div className="registrationDiv">
                    <Field name="username" component={renderLoginField} label="Username :"
                           validate={[required, email]}/>
                    <Field style={{marginBottom: "7px"}} name="password" component={renderLoginField} type="password"
                           label="Password :"
                           validate={[required]}/>
                </div>
            </div>
            <div className="login-footer" style={{background: '#E7E7E7'}}>
                <button type="submit" className="btn btn-custom login-btn">Submit</button>
            </div>
        </div>
    </Form>
}

LoginForm = reduxForm({
    form: "LoginForm"
})(LoginForm)

export default LoginForm