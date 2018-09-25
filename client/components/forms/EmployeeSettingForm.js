import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderField} from './fields'
import {number, required} from "./validation";
import {connect} from 'react-redux'

class EmployeeSettingForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, submitting, _id} = this.props;
        return (
                <form key="EmployeeSettingForm" onSubmit={this.props.handleSubmit}>
                    <div className="clearfix">
                        <div className="col-md-4">

                            <Field name="_id" component="input" type="hidden"/>
                            <Field name="minPlannedHours" label="Min Planned Hours:" component={renderField}
                                   validate={[required, number]}/>
                            <Field name="maxPlannedHours" label="Max Planned Hours:" component={renderField}
                                   validate={[required, number]}/>
                            <Field name="free" label="Free:" component={renderField} validate={[required]}/>
                            <Field name="relativelyFree" label="Relatively Free:" component={renderField}
                                   validate={[required, number]}/>
                            <Field name="someWhatBusy" label="Somewhat Busy:" component={renderField}
                                   validate={[required, number]}/>
                            <Field name="busy" label="Busy:" component={renderField} validate={[required, number]}/>
                            <Field name="superBusy" label="Super Busy:" component={renderField}
                                   validate={[required, number]}/>
                            <button type="submit" style={{margin:'10px 0px'}}
                                    disabled={pristine || submitting}
                                    className="btn customBtn">{(!this.props._id && "Create") || (this.props._id && "Update")}
                            </button>

                        </div>
                    </div>
                </form>
        )
    }
}

EmployeeSettingForm = reduxForm({
    form: 'employee-setting'
})(EmployeeSettingForm)

const selector = formValueSelector('employee-setting')

EmployeeSettingForm = connect(
    state => {
        const _id = selector(state, '_id')
        return {_id}

    }
)(EmployeeSettingForm)

export default EmployeeSettingForm
