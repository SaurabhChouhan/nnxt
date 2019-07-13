import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderText, renderTextArea, renderDateTimeStringShow } from './fields'
import { required } from "./validation"

let BillingTaskDescriptionForm = (props) => {
    const { handleSubmit, submitting } = props;
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="releasePlan.name"
                    component={renderText}
                    label={"Task Name"} readOnly={true} />
            </div>
            <div className="col-md-3">
                <Field name="billingDate"
                    component={renderText}
                    label={"Billing Date:"} readOnly={true} />
            </div>
            <div className="col-md-3">
                <Field name="billingEmployee.name"
                    component={renderText}
                    label={"Billing Employee:"} readOnly={true} />
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <Field name="description"
                    className="billing-task-description"
                    component={renderTextArea}
                    label={"Timesheet Description"} validate={[required]} rows={10} />

                <button type="submit" disabled={submitting} className="btn customBtn">Submit</button>
            </div>
        </div>

    </form>
}

BillingTaskDescriptionForm = reduxForm({
    form: 'billing-task-description'
})(BillingTaskDescriptionForm)

export default BillingTaskDescriptionForm