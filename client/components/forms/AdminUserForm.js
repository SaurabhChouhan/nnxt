import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {renderField, renderMultiselect} from './fields'
import {required} from "./validation";

class AdminUserForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return [
            <div key="AdminUserFormBackButton">
                <button type="button"
                        onClick={() => this.props.showAdminUserList()}>
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>
            </div>,
            <form key="AdminUserForm" onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Field name="firstName" label="First Name:" component={renderField} type="text"/>
                        <Field name="lastName" label="Last Name:" component={renderField} type="text"/>
                        <Field
                            name="roles"
                            component={renderMultiselect} label="Roles:"
                            data={this.props.roles} validate={[required]} valueField="_id" textField="name"/>
                        <Field name="email" label="Email:" component={renderField} type="email"/>
                        <Field name="password" label="Password:" component={renderField} type="password"/>
                        <button type="submit"
                                className="btn btn-submit"> {(!this.props._id && "Add") || (this.props._id && "Update")} </button>
                    </div>
                </div>
            </form>
        ]

    }
}

AdminUserForm = reduxForm({
    form: 'admin-user'
})(AdminUserForm)

export default AdminUserForm
// {(!this.props._id && "Add") || (this.props._id && "Update")}