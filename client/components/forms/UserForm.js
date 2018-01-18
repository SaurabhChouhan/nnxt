import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {renderText, renderTextArea, renderMultiselect} from './fields'
import {required, email, passwordLength} from "./validation"
import {connect} from 'react-redux'
import * as logger from '../../clientLogger'

const passwordMatch = (value, values) => {
    //console.log("pm ", value, values)
    return (value != values.password) ? `Should match password value` : undefined
}

class UserForm extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        logger.debug(logger.USER_FORM_RENDER, 'props', this.props)
        const {_id, changeCredentials} = this.props;

        return [
            <div key="UserFormBackButton">
                <button type="button"
                        onClick={() => this.props.showUserList()}>
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>
            </div>,
            <form key="UserForm" onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Field name="_id" component="input" className="form-control" type="hidden"></Field>
                        <Field name="firstName" label="First Name:" component={renderText} type="text"
                               validate={[required]}/>

                        <Field name="lastName" label="Last Name:" component={renderText} type="text"
                               validate={[required]}/>
                        <Field
                            name="roles"
                            component={renderMultiselect} label="Roles:"
                            data={this.props.roles} validate={[required]} valueField="_id" textField="name"/>

                        <Field name="email" label="Email:" component={renderText} type="email"
                               validate={[required, email]}/>


                        {this.props._id &&
                        <div>
                            <label><Field name="changeCredentials" component="input" type="checkbox"/>Change
                                Credentials</label>
                        </div>
                        }
                        {(!this.props._id || changeCredentials) &&
                        <Field name="password" label="Password:" component={renderText} type="password"
                               validate={[required, passwordLength]}/>}

                        {(!this.props._id || changeCredentials) &&
                        <Field name="confirmPassword" label="Confirm Password:" component={renderText} type="password"
                               validate={[required, passwordLength, passwordMatch]}/>}

                        <button type="submit"
                                className="btn btn-submit"> {(!this.props._id && "Add") || (this.props._id && "Update")} </button>
                    </div>
                </div>
            </form>]

    }
}

UserForm = reduxForm({
    form: 'user'
})(UserForm)

const selector = formValueSelector('user')

UserForm = connect(
    state => {
        const {_id, changeCredentials} = selector(state, '_id', 'changeCredentials')
        const selectedRoles = selector(state, 'roles')
        console.log("ID OBTAINED  IN SELECTOR", _id)
        console.log("changeCredentials in USERFORM", changeCredentials)
        return {
            _id,
            changeCredentials,
            selectedRoles
        }
    }
)(UserForm)


export default UserForm
