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
        let { getInReviewBillingPlans, fetchBillingProjects, addBillingTaskCriteria } = this.props
        return <form>
            <div className="col-md-12">
                <div className="col-md-2 pad">
                    <Field name="clientID"
                        onChange={(event, newValue, oldValue) => {
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
                    <Field name="fromDate"
                        component={renderDateTimePickerString}
                        onChange={(event, newValue, oldValue) => {
                            // Make call to get release plan only when release id is part of criteria which means a release id is open
                            if (criteria.releaseID) {
                                getInReviewBillingPlans(Object.assign({}, criteria, {
                                    fromDate: newValue
                                }))
                            } else {
                                addBillingTaskCriteria(Object.assign({}, criteria, {
                                    fromDate: newValue
                                }))
                            }
                        }}
                        showTime={false}
                        label={"From:"} />
                </div>
                <div className="col-md-2">
                    <Field name="toDate"
                        component={renderDateTimePickerString}
                        onChange={(event, newValue, oldValue) => {
                            // Make call to get release plan only when release id is part of criteria which means a release id is open
                            if (criteria.releaseID) {
                                getInReviewBillingPlans(Object.assign({}, criteria, {
                                    toDate: newValue
                                }))
                            } else {
                                addBillingTaskCriteria(Object.assign({}, criteria, {
                                    toDate: newValue
                                }))
                            }
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
