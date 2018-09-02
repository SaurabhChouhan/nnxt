import {Field, Form, reduxForm} from 'redux-form'
import React from 'react'
import {email, required} from './validation'
import {renderLoginField} from "./fields";

let LoginForm = (props) => {
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
                <header>LOGIN TO <span><b>NNXT</b></span> DASHBOARD</header>
                <Form onSubmit={handleSubmit}>
                    {errorMsg &&
                    <div style={{width: "100%", textAlign: "center"}}>
                        <span className="validation-error"
                              style={{fontSize: '20px'}}>{errorMsg}</span>
                    </div>}
                    <Field name="username" component={renderLoginField} label="Username :"
                           validate={[required, email]}/>
                    <Field style={{marginBottom: "7px"}} name="password" component={renderLoginField} type="password"
                           label="Password :" validate={[required]}/>
                    <br/>
                    {/*
                    <div className="col-md-12">
                        <span className="pull-right"> <a href="#"><u>Forgot password ?</u></a><br/></span>
                    </div>
                    */}
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

LoginForm = reduxForm({
    form: "LoginForm"
})(LoginForm)

export default LoginForm