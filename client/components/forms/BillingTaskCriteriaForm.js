import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderDateTimePickerString, renderSelect } from '../forms/fields'

class BillingTaskCriteriaForm extends Component {
    componentWillMount() {
        this.props.fetchBillingClients(this.props.criteria)
    }

    componentDidMount() {
        this.props.initialize(this.props.criteria)
    }

    render() {
        let { clients, releases, criteria } = this.props
        // actions
        let { getInReviewBillingPlans, fetchBillingProjects } = this.props
        return <form>
            <div className="col-md-12">
                <div className="col-md-2 pad">
                    <Field name="clientID"
                        onChange={(event, newValue, oldValue) => {
                            /*
                            getInReviewBillingPlans(Object.assign({}, criteria, {
                                clientID: newValue,
                                releaseID: undefined
                            }))
                            */
                           fetchBillingProjects(Object.assign({}, criteria, {
                                clientID: newValue,
                                releaseID: undefined
                            }))
                        }}
                        label={'Client:'}
                        component={renderSelect}
                        showNoneOption={true}
                        options={clients}
                    />
                </div>
                <div className="col-md-2">
                    <Field name="releaseID"
                        onChange={(event, newValue, oldValue) => {
                            getInReviewBillingPlans(Object.assign({}, criteria, {
                                releaseID: newValue
                            }))
                        }}
                        component={renderSelect}
                        options={releases}
                        label={'Release:'}
                    />
                </div>
                <div className="col-md-2">
                    <Field name="fromDate"
                        component={renderDateTimePickerString}
                        onChange={(event, newValue, oldValue) => {
                            getInReviewBillingPlans(Object.assign({}, criteria, {
                                fromDate: newValue
                            }))
                        }}
                        showTime={false}
                        label={"From:"} />
                </div>
                <div className="col-md-2">
                    <Field name="toDate"
                        component={renderDateTimePickerString}
                        onChange={(event, newValue, oldValue) => {
                            getInReviewBillingPlans(Object.assign({}, criteria, {
                                toDate: newValue
                            }))
                        }}
                        showTime={false}
                        label={"To:"} />
                </div>

            </div>
        </form>
    }
}

BillingTaskCriteriaForm = reduxForm({
    form: 'billing-task-criteria'
})(BillingTaskCriteriaForm)

export default BillingTaskCriteriaForm
