import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderField, renderTextArea, renderSelect, renderDateTimePickerString} from './fields'
import {required, number} from "./validation";
import {connect} from 'react-redux'
import * as SC from '../../../server/serverconstants'

class HolidayForm extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, submitting, reset, _id} = this.props;
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
                               options={SC.HOLIDAY_TYPE_LIST_WITH_NAME}/>

                        <Field width="80%" name="description" validate={[required]} component={renderTextArea}
                               label="Description:"/>

                        <div>
                            <button type="submit"
                                    className="btn btn-submit">
                                {(!_id && "Add") || (_id && "Update")}
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
