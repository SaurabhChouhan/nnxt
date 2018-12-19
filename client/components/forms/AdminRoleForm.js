import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderMultiSelect, renderText} from './fields'

class AdminRoleForm extends Component {

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return (
            <div className="col-md-8">
                <div className="col-md-12 pad">
                    <div key="AdminRoleFormBackButton">
                        <button className="glyphicon glyphicon-arrow-left customBtn pull-left btn" type="button" style={{margin:'10px 0px'}}
                                onClick={() => this.props.showRoleList()}>
                        </button>
                    </div>
                </div>
                <div className="col-md-12 pad">
                    <form key="AdminRoleForm" onSubmit={handleSubmit}>

                        <Field name="name" component={renderText} label="Roles:" valueField="_id" disabled={true}
                               readOnly={true} textField="name"/>
                        <Field name="permissions" component={renderMultiSelect} label="permission:"
                               data={this.props.permissionOptions}
                               valueField="_id" textField="name"/>
                        <div className={'col-md-12 pad'}>
                            <div className={'col-md-2 pad'}>
                                <button type="submit" style={{margin:'10px 0px'}} disabled={pristine || submitting} className="btn customBtn">
                                    Update
                                </button>
                            </div>
                            <div className={'col-md-2'}>
                                <button type="button" style={{margin:'10px 0px'}} disabled={pristine || submitting} className="btn customBtn"
                                        onClick={reset}>Reset
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )

    }
}

AdminRoleForm = reduxForm({
    form: 'admin-role-form'
})(AdminRoleForm)
export default AdminRoleForm


