import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderDateTimePickerString, renderSelect, renderTextArea } from '../forms/fields'

let BillingTaskForm = (props) => {
    return <div className="col-md-12 billing-desc-content">
        <form onSubmit={props.handleSubmit(props.reviewDescription)}>
            <div className="btask-form-col-md">
                <Field name="billedDate" component={renderDateTimePickerString} label={""} />
            </div>
            <div className="btask-form-col-sm">
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
            <div className="btask-form-col-md">
                <Field name="billingEmployee._id" placeholder={"Name of Developer"}
                    component={renderSelect}
                    options={props.projectTeam}
                    onChange={(event, newValue, oldValue) => {
                        //props.change("employee.name", employee.name)
                    }} />
            </div>
            <div className="btask-form-col-md">
                <Field name="timesheetEmployee._id" placeholder={"Name of Developer"}
                    component={renderSelect}
                    options={props.projectTeam}
                    onChange={(event, newValue, oldValue) => {
                        //props.change("employee.name", employee.name)
                    }} />
            </div>
            <div className="btask-form-col-bg">
                <Field name="description"
                    component={renderTextArea}
                    type="text" />
            </div>
            <div className="btask-form-col-md">
                <button type="submit" className="btn customBtn" disabled={props.submitting}>Review</button>
            </div>
        </form>
    </div>

}

BillingTaskForm = reduxForm({
    form: 'billing-task-form'
})(BillingTaskForm)


let BillingTask = (props) => {
    let billingTask = props.billingTask
    return <div className="billing-reports text-center">
        <div className="billing-dateName">
            <div className="br-colmn1">
                <h4>{billingTask.planningDate}</h4>
            </div>
            <div className="br-colmn2">
                <h4>{billingTask.taskPlan.report.reportedHours}</h4>
            </div>
            <div className="br-colmn3">
                <h4 className="pull-left">{billingTask.taskPlan.employee.name}</h4>
            </div>
        </div>
        <div class="billing-desc">
            <BillingTaskForm key={'billing-task-form-' + billingTask._id} form={'billing-task-form-' + billingTask._id} initialValues={billingTask} projectTeam={props.projectTeam} reviewDescription={props.reviewDescription} />
        </div>
    </div >
}

let BillingReleasePlan = (props) => {
    let releasePlan = props.releasePlan
    return [<div key='release-plan-heading' className="col-md-12 ">
        <div className="billing-section">
            <div className="billing-entries">
                <div className="bil-rp-col40">
                    <h4>{releasePlan.name}</h4>
                </div>
                <div className="bil-rp-col12">
                    <h4>Estimated: {releasePlan.estimatedHours} hrs</h4>
                </div>
                <div className="bil-rp-col12">
                    <h4>Unbilled: {releasePlan.unbilledHours} hrs</h4>
                </div>
                <div className="bil-rp-col12">
                    <h4>Billed: {releasePlan.billingHours} hrs</h4>
                </div>
                <div className="bil-rp-col12">
                    <h4>Earned: {releasePlan.earnedHours} hrs</h4>
                </div>
                <div className="bil-rp-col12">
                    <h4>Pending: {releasePlan.suggestedHours >= 0 ? '+' + releasePlan.suggestedHours : '-' + (-releasePlan.suggestedHours)} hrs</h4>
                </div>
            </div>
        </div>
    </div>, <div key='release-plan-task-plans' className="col-md-12 ">
        <div className="billing-section">
            {releasePlan.billingTasks.map((bt, idx) => <BillingTask key={'billing-task-' + bt._id} billingTask={bt} tpIdx={idx} rpIdx={props.rpIdx} projectTeam={props.projectTeam} reviewDescription={props.reviewDescription} />
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
                        <div className="colmn7">
                            <h4>Reported</h4>
                        </div>
                        <div className="colmn5">
                            <h4>Hours</h4>
                        </div>
                        <div className="colmn18">
                            <h4>Developers</h4>
                        </div>
                        <div className="colmn105">
                            <h4>Billed Date</h4>
                        </div>
                        <div className="colmn105">
                            <h4>Hours Billed</h4>
                        </div>
                        <div className="colmn105">
                            <h4>Earned By</h4>
                        </div>
                        <div className="colmn105">
                            <h4>TS Name</h4>
                        </div>
                        <div className="colmn21">
                            <h4>Description</h4>
                        </div>
                        <div className="colmn7">
                            <h4>Action</h4>
                        </div>
                    </div>
                </div>
            </div>
            {
                this.props.inReviewBillingPlans.map((rp, idx) => <BillingReleasePlan key={'billing-release-plan-' + rp._id} releasePlan={rp} rpIdx={idx} projectTeam={this.props.projectTeam} reviewDescription={this.props.reviewDescription} />)
            }
        </div>
    }
}

export default BillingTaskList