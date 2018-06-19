import {required} from "./validation"
import {renderDateTimePickerString, renderSelect, renderTextArea} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()

class LeaveApprovalReasonForm extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.saveIsApproved(this.props.isApproved)
    }

    render() {
        const {pristine, submitting, reset, handleSubmit, isApproved} = this.props
        return <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <Field name="leaveID" component="input" type="hidden"/>
                    <Field name="isApproved" component="input" type="hidden"/>
                    <Field width="80%" name="reason" validate={[required]} component={renderTextArea}
                           label="Reason:"/>
                    <button type="submit" disabled={pristine || submitting} className="btn customBtn"> Submit</button>
                </div>

            </div>

        </form>
    }
}

LeaveApprovalReasonForm = reduxForm({
    form: 'leave-approval'

})(LeaveApprovalReasonForm)

export default LeaveApprovalReasonForm