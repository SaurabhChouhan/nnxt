import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderText, renderTextArea } from './fields'
import { required } from "./validation"

let BillingTaskDescriptionForm = (props) => {
    const { handleSubmit, submitting } = props;
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="taskName"
                    component={renderText}
                    label={"Task Name"} readOnly={true} />
            </div>
            <div className="col-md-6">
                <Field name="status"
                    component={renderText}
                    label={"Status you are reporting:"} readOnly={true} />
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <Field name="description"
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