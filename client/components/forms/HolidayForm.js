import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderField, renderTextArea, renderSelect, renderDateTimePickerString} from './fields'
import {required, number} from "./validation";
import {connect} from 'react-redux'

class HolidayForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, change, submitting, MONTHS_WITH_MONTH_NUMBER, HOLIDAY_TYPE_LIST, reset, _id} = this.props;
        return [
            <div key="HolidayFormBackButton">
                <button type="button"
                        onClick={() => this.props.showHolidayList()}>
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>
            </div>,
            <form key="HolidayForm" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">

                        <Field name="_id" component="input" type="hidden"/>

                        <Field name="dateString" placeholder={"holiday Date :"}
                               component={renderDateTimePickerString}
                               showTime={false}
                               label={"Holiday Date :"} validate={[required]}/>

                        <Field name="holidayName" label="Holiday Name:" component={renderField}
                               validate={[required]}/>

                        <Field name="holidayType" label="Holiday Type:" component={renderSelect}
                               validate={[required]}
                               options={HOLIDAY_TYPE_LIST}/>

                        <Field width="80%" name="description" validate={[required]} component={renderTextArea}
                               label="Description:"/>

                        <div>
                            <button type="submit"
                                    className="btn btn-submit">
                                {(!this.props._id && "Add") || (this.props._id && "Update")}
                            </button>
                            <button type="button"
                                    disabled={pristine || submitting}
                                    className="btn btn-submit" onClick={reset}>Reset
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        ]
    }
}

HolidayForm = reduxForm({
    form: 'holiday-form'
})(HolidayForm)

const selector = formValueSelector('holiday-form')

HolidayForm = connect(
    state => {
        const _id = selector(state, '_id')
        return {
            _id
        }
    }
)(HolidayForm)
export default HolidayForm
