import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {renderText, renderTextArea, renderMultiselect, renderField} from './fields'
import {required, email, passwordLength} from "./validation"

const passwordMatch = (value, values) => {
    //console.log("pm ", value, values)
    return (value != values.password) ? `Should match password value` : undefined
}


class UserProfileForm extends Component {
    constructor() {
        super()
    }

    render() {
        const {handleSubmit, pristine, reset, submitting, addUser, editUser, changeCredentials} = this.props;

        return [
            <h2 key="userProfileFormHeading">This is user profile page</h2>,
            <div className="row">
                <div className="col-md-6">
                    <form key="userProfileForm" onSubmit={this.props.handleSubmit}>
                        <div className={"col-md-12"}>
                            <input type="submit" value="SAVE" className="btn squareButton"
                                   disabled={pristine || submitting}/>
                            <button onClick={() => this.props.reset()} type="button" className="btn squareButton"
                                    disabled={pristine || submitting}>RESET
                            </button>
                        </div>
                        <div className={"col-md-12"}>
                            <h4>User Info</h4>
                            <Field name="firstName" label="First Name:" component={renderField} validate={[required]}
                                   type="text"/>
                            <Field name="lastName" label="Last Name:" component={renderField} validate={[required]}
                                   type="text"/>
                            <Field
                                name="roles"
                                component={renderMultiselect}
                                label="Roles:"
                                disabled={true}
                                data={this.props.roles} valueField="_id" textField="name"/>
                            <Field name="email" label="Email:" validate={[required, email]} component={renderField}
                                   type="email"/>
                            <Field name="password" label="Password:" validate={[required, passwordLength]}
                                   component={renderField} type="password"/>
                            <Field name="confirmPassword" label="Confirm Password:"
                                   validate={[required, passwordLength, passwordMatch]} component={renderField}
                                   type="password"/>
                        </div>
                    </form>
                </div>
            </div>
        ]
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