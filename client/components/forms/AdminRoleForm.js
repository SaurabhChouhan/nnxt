import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderMultiSelect, renderText} from './fields'

class AdminRoleForm extends Component {

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return [
            <div key="AdminRoleFormBackButton">
                <button type="button"
                        onClick={() => this.props.showRoleList()}>
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>
            </div>,
            <form key="AdminRoleForm" onSubmit={handleSubmit}>

                <Field name="name" component={renderText} label="Roles:" valueField="_id" disabled={true}
                       readOnly={true} textField="name"/>
                <Field name="permissions" component={renderMultiSelect} label="permission:"
                       data={this.props.permissionOptions}
                       valueField="_id" textField="name"/>
                <div className={'col-md-12'}>
                    <div className={'col-md-2'}>
                        <button type="submit" disabled={pristine || submitting} className="btn squareButton">
                            Update
                        </button>
                    </div>
                    <div className={'col-md-2'}>
                        <button type="button" disabled={pristine || submitting} className="btn squareButton"
                                onClick={reset}>Reset
                        </button>
                    </div>
                </div>
            </form>
        ]

    }
}

AdminRoleForm = reduxForm({
    form: 'admin-role-form'
})(AdminRoleForm)
export default AdminRoleForm


