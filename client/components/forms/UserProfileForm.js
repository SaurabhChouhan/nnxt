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

        return <div className="row">
            <div className="col-md-6">
                <form key="userProfileForm" onSubmit={this.props.handleSubmit}>

                    <div className={"col-md-12"}>
                        <Field name="firstName" label="First Name:" component={renderField} validate={[required]}
                               type="text"/>
                        <Field name="lastName" label="Last Name:" component={renderField} validate={[required]}
                               type="text"/>
                        <Field name="email" label="Email:" validate={[required, email]} component={renderField}
                               type="email"/>
                        <Field name="password" label="Password:" validate={[passwordLength]}
                               component={renderField} type="password"/>
                        <Field name="confirmPassword" label="Confirm Password:"
                               validate={[passwordLength, passwordMatch]} component={renderField}
                               type="password"/>
                    </div>
                    <div className={"col-md-12"}>
                        <input type="submit" value="SAVE" className="btn btn-default btn-submit addBtn"
                               disabled={pristine || submitting}/>

                        <button onClick={() => this.props.reset()} type="button"
                                className="btn btn-default btn-submit addBtn"
                                style={{'marginLeft': '5px'}}
                                disabled={pristine || submitting}>RESET
                        </button>
                    </div>
                </form>
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