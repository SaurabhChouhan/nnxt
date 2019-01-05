import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderDateTimePickerString, renderSelect, renderTextArea } from '../forms/fields'

let billingTaskFormSubmit = (values) => {
    console.log("values ", values)
}

let BillingTaskForm = (props) => {
    return <div className="col-md-12 billing-desc-content">
        <form onSubmit={props.handleSubmit(billingTaskFormSubmit)}>
            <div className="colmn1">
                <Field name="billedDate" component={renderDateTimePickerString} label={""} />
            </div>
            <div className="colmn1">
                <Field name="billedHours"
                    placeholder={"Hours"}
                    component={renderSelect}
                    options={
                        [{ 'name': '0.5' }, { 'name': '1' }, { 'name': '1.5' }, { 'name': '2' }, { 'name': '2.5' }, { 'name': '3' }, { 'name': '3.5' },
                        { 'name': '4' }, { 'name': '4.5' }, { 'name': '5' }, { 'name': '5.5' }, { 'name': '6' }, { 'name': '6.5' }, { 'name': '7' },
                        { 'name': '7.5' }, { 'name': '8' }, { 'name': '8.5' }, { 'name': '9' }, { 'name': '9.5' }, { 'name': '10' }, { 'name': '10.5' }
                            , { 'name': '11' }, { 'name': '11.5' }, { 'name': '12' }]}
                    valueField={"name"}
                />
            </div>
            <div className="colmn1">
                <Field name="billingEmployee._id" placeholder={"Name of Developer"}
                    component={renderSelect}
                    options={[{ _id: 1, name: 'Saurabh' }, { _id: 2, name: 'Mahesh' }]}
                    onChange={(event, newValue, oldValue) => {
                        //props.change("employee.name", employee.name)
                    }} />
            </div>
            <div className="colmn1">
                <Field name="timesheetEmployee._id" placeholder={"Name of Developer"}
                    component={renderSelect}
                    options={[{ _id: 1, name: 'Saurabh' }, { _id: 2, name: 'Mahesh' }]}
                    onChange={(event, newValue, oldValue) => {
                        //props.change("employee.name", employee.name)
                    }} />
            </div>
            <div className="colmn2">
                <Field name="description"
                    component={renderTextArea}
                    type="text" />
            </div>
            <div className="colmn1Last">
                <button type="submit" className="btn customBtn" disabled={props.submitting || props.pristine}>Save</button>
            </div>
        </form>
    </div>

}

BillingTaskForm = reduxForm({
    form: 'billing-task-form'
})(BillingTaskForm)


let BillingTaskPlan = (props) => {
    let taskPlan = props.taskPlan
    return <div className="billing-reports text-center">
        <div className="billing-dateName">
            <div className="br-colmn1">
                <h4>{taskPlan.planningDate}</h4>
            </div>
            <div className="br-colmn2">
                <h4>{taskPlan.reportedHours}</h4>
            </div>
            <div className="br-colmn3">
                <h4 className="pull-left">{taskPlan.employeeName}</h4>
                <button type="button" className="btn customBtn pull-right"><i className="fa fa-plus-circle"></i></button>
            </div>
        </div>
        <div class="billing-desc">
            {taskPlan.billingTasks.map((bt, idx) => <BillingTaskForm key={'billing-task-form-' + idx} form={'billing-task-form-' + props.taskPlanIdx + '-' + idx} initialValues={bt} />)}
        </div>
    </div >
}

let BillingReleasePlan = (props) => {
    let releasePlan = props.releasePlan
    return [<div key='release-plan-heading' className="col-md-12 ">
        <div className="billing-section">
            <div className="billing-entries">
                <div className="col-md-3">
                    <h4>Estimated Amount: ${releasePlan.estimatedAmount}</h4>
                </div>
                <div className="col-md-3">
                    <h4>Billed Amount: ${releasePlan.billingAmount}</h4>
                </div>
                <div className="col-md-3">
                    <h4>Suggested Earning: ${releasePlan.earning}</h4>
                </div>
                <div className="col-md-3">
                    <h4>Suggested Billing: +${releasePlan.suggestedBilling}</h4>
                </div>
            </div>
        </div>
    </div>, <div key='release-plan-task-plans' className="col-md-12 ">
        <div className="billing-section">
            {releasePlan.taskPlans.map((tp, idx) => <BillingTaskPlan key={'billing-task-plan-' + idx} taskPlan={tp} taskPlanIdx={idx} />
            )}
        </div>
    </div>]
}

class BillingTaskList extends Component {

    render() {
        return <div>
            <div className="col-md-12 ">
                <div className="billing-section">
                    <div className="billing-header text-center">
                        <div className="colmn1">
                            <h4>Date Reported</h4>
                        </div>
                        <div className="colmn5">
                            <h4>Hours</h4>
                        </div>
                        <div className="colmn15">
                            <h4>Developers</h4>
                        </div>
                        <div className="colmn1">
                            <h4>Billed Date</h4>
                        </div>
                        <div className="colmn1">
                            <h4>Hours Billed</h4>
                        </div>
                        <div className="colmn1">
                            <h4>Earned By</h4>
                        </div>
                        <div className="colmn1">
                            <h4>For Client</h4>
                        </div>
                        <div className="colmn2">
                            <h4>Description</h4>
                        </div>
                        <div className="colmn1">
                            <h4>Action</h4>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.props.billingData.map((rp, idx) => <BillingReleasePlan key={'billing-release-plan-' + idx} releasePlan={rp} />)
            }
        </div>
    }
}

export default BillingTaskList