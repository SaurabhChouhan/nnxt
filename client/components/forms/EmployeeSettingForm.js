import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderField, renderDateTimePickerString} from './fields'
import {required} from "./validation";

class EmployeeSettingForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, reset, submitting} = this.props;
        return [
            <form key="EmployeeSettingForm" onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <Field name=" minPlannedHours" label="Min Planned Hours:" component={renderField}
                               validate={[required]}/>
                        <Field name=" maxPlannedHours" label="Max Planned Hours:" component={renderField}
                               validate={[required]}/>
                        <Field name="free" label="Free:" component={renderField} validate={[required]}/>
                        <Field name="relatively free" label="Relatively Free:" component={renderField}
                               validate={[required]}/>
                        <Field name="busy" label="Busy:" component={renderField} validate={[required]}/>
                        <Field name="super busy" label="Super Busy:" component={renderField}
                               validate={[required]}/>
                        <button type="submit"
                                disabled={pristine || submitting}
                                className="btn btn-submit">Submit
                        </button>

                        <button type="button" disabled={pristine || submitting} className="btn squareButton"
                                onClick={reset}>Reset
                        </button>

                    </div>
                </div>
            </form>
        ]

    }
}

EmployeeSettingForm = reduxForm({
    form: 'employee-setting'
})(EmployeeSettingForm)

export default EmployeeSettingForm
