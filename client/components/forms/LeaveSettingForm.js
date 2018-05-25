import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderField} from './fields'
import {required, number} from "./validation";
import {connect} from 'react-redux'

class LeaveSettingForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, submitting, _id} = this.props;
        return (
            <form key="LeaveSettingForm" onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-4">

                        <Field name="_id" component="input" type="hidden"/>
                        <Field name="casualLeaves" label="Casual Leaves:" component={renderField}
                               validate={[required, number]}/>
                        <Field name="paidLeaves" label="Paid Leaves:" component={renderField}
                               validate={[required, number]}/>
                        <Field name="maternityLeaves" label="Maternity Leaves:" component={renderField}
                               validate={[required]}/>
                        <Field name="paternityLeaves" label="Paternity Leaves:" component={renderField}
                               validate={[required, number]}/>
                        <Field name="specialLeaves" label="Special Leaves:" component={renderField}
                               validate={[required, number]}/>
                        <button type="submit"
                                disabled={pristine || submitting}
                                className="btn btn-submit">{(!this.props._id && "Create") || (this.props._id && "Update")}
                        </button>

                    </div>
                </div>
            </form>
        )
    }
}

LeaveSettingForm = reduxForm({
    form: 'leave-setting'
})(LeaveSettingForm)

const selector = formValueSelector('leave-setting')

LeaveSettingForm = connect(
    state => {
        const _id = selector(state, '_id')
        return {_id}

    }
)(LeaveSettingForm)

export default LeaveSettingForm
