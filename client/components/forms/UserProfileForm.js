import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {renderDateTimePickerString, renderField, renderText, renderTextArea} from './fields'
import {email, number, passwordLength, required} from "./validation"


const passwordMatch = (value, values) => {
    return (value != values.password) ? `both password field should be same ` : undefined
}

class UserProfileForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;

        return <div className="col-md-8">
            <div className="col-md-12">
                <div className="col-md-12 pad">
                    <div className="col-md-12">
                        <form key="userProfileForm" onSubmit={handleSubmit}>
                            {/*firstname lastName*/}
                            <div className="row">

                                <div className="col-md-6">
                                    <Field name="firstName" placeholder={"First Name"} component={renderText}
                                           label={"First Name:"} validate={[required]}/>
                                </div>
                                <div className="col-md-6">
                                    <Field name="lastName" label={"Last Name :"} placeholder={"Last Name"}
                                           component={renderText} validate={[required]}/>
                                </div>
                            </div>


                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="phone" label={"Phone No.:"} placeholder={"phone Name"}
                                           component={renderText} validate={[number]}/>
                                </div>
                                <div className="col-md-6">
                                    <Field name="email" label={"Email :"} placeholder={"Email"}
                                           validate={[required, email]}
                                           component={renderText} type="email"/>

                                </div>

                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="address" label={"Address :"} placeholder={"address"}
                                           component={renderTextArea} />
                                </div>

                            </div>

                            <div className="row">


                                <div className="col-md-6">
                                    <Field name="password" label={"New Password :"} placeholder={"new Password"}
                                           validate={[passwordLength]}
                                           component={renderText} type="password"/>
                                </div>

                                <div className="col-md-6">

                                    <Field name="confirmPassword" label="Confirm Password :"
                                           placeholder={"confirm Password"}
                                           validate={[passwordLength, passwordMatch]} component={renderField}
                                           type="password"/>
                                </div>
                            </div>

                            <div className="row">

                                <div className="col-md-6">
                                    <Field name="dob" placeholder={"date of birth :"}
                                           component={renderDateTimePickerString}
                                           showTime={false}
                                           label={"DOB :"}/>
                                </div>

                                <div className="col-md-6">
                                    <Field name="designation" label={"designation :"}
                                           placeholder={"Employee-designation"}
                                           component={renderText} readOnly={true}/>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <Field name="employeeCode" label={"code :"} placeholder={"Employee-Code"}
                                           component={renderText} readOnly={true}/>
                                </div>
                                <div className="col-md-6">

                                    <Field name="dateJoined" label={"Date of joining :"}
                                           placeholder={"Employee-date of joining"}
                                           component={renderText} readOnly={true}/>
                                </div>
                            </div>
                            <div className="row updateUserProfile">
                                <div className="col-md-6 text-right">
                                    <button type="submit" disabled={pristine || submitting} className="btn customBtn">
                                        Update
                                    </button>
                                </div>
                                <div className="col-md-6 text-left">
                                    <button type="button" disabled={pristine || submitting} className="btn customBtn"
                                            onClick={reset}>Reset
                                    </button>
                                </div>
                            </div>


                        </form>

                    </div>
                </div>
            </div>
        </div>

    }
}

UserProfileForm = reduxForm({
    form: 'user-profile'
})(UserProfileForm)

const selector = formValueSelector('user-profile');

UserProfileForm = connect(
    state => {
        const changeCredentials = selector(state, 'changeCredentials')
        return {changeCredentials};
    }
)(UserProfileForm)
export default UserProfileForm