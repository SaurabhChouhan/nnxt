import {reduxForm, Field, Form} from 'redux-form'
import React from 'react'
import {required, email} from './validation'
import {renderLoginField} from "./fields";

let LoginForm = (props) => {
    console.log("loginForm->props ", props)
    return <div>
        <div className="col-md-12 loginsection">
            <div className="col-md-5 login_img ">
                <h1>WELCOME TO</h1>
                <p>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                    and scrambled it to make a type specimen book.</p>

            </div>
            <div className="col-md-7 loginform">
                <header>LOGIN TO <span><b>NNXT</b></span> DASHBOARD</header>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ex risus, pharetra et efficitur non,
                    tristique ac elit.</p>
                <Form onSubmit={props.handleSubmit}>
                    {props.errorMsg &&
                    <div style={{width: "100%", textAlign: "center"}}><span className="validation-error"
                                                                            style={{fontSize: '20px'}}>{props.errorMsg}</span>
                    </div>}
                    <Field name="username" component={renderLoginField} label="Username :"
                           validate={[required, email]}/>
                    <Field style={{marginBottom: "7px"}} name="password" component={renderLoginField} type="password"
                           label="Password :" validate={[required]}/>
                    <br/>
                    <span> <a href="#"><u>Forgot password ?</u></a><br/></span>
                    <button type="submit" className="btn  login-btn">Submit</button>
                    <label className="signupoption">Do you have an account ?<a href="#"><u> Sign Up</u></a></label>

                    <footer>  &copy; Copyright all rights reserved. <strong> Aripra Infotech Pvt Ltd</strong></footer>
                </Form>

            </div>
        </div>

    </div>
}

LoginForm = reduxForm({
    form: "LoginForm"
})(LoginForm)

export default LoginForm