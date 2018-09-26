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
            <div key="HolidayFormBackButton" className="col-md-12">
                <button className="glyphicon glyphicon-arrow-left btn customBtn" style={{margin: '10px 0px'}}
                        type="button"
                        onClick={() => this.props.showHolidayList()}>
                </button>
            </div>,
            <form key="HolidayForm" onSubmit={handleSubmit}>
                <div className="clearfix">
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
                            <div className="col-md-2 pad">
                                <button type="submit" style={{margin: '10px 0px'}}
                                        className="btn customBtn">
                                    {(!_id && "Add") || (_id && "Update")}
                                </button>
                            </div>
                            <div className="col-md-2 pad">
                                <button type="button" style={{margin: '10px 0px'}}
                                        disabled={pristine || submitting}
                                        className="btn customBtn" onClick={reset}>Reset
                                </button>
                            </div>
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
