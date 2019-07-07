import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderDateTimePickerString, renderSelect } from '../forms/fields'

class BillingTaskCriteriaForm extends Component {

    componentDidMount() {
        this.props.initialize(this.props.criteria)
    }

    render() {
        let { clients, releases, criteria } = this.props
        // actions
        let { fetchBillingReleases, fetchiBillingTasks, fetchBillingClients } = this.props
        return <form>
            <div className="col-md-12">
                <div className="col-md-2">
                    <Field name="fromDate"
                        component={renderDateTimePickerString}
                        onChange={(event, newValue, oldValue) => {
                            fetchBillingClients(Object.assign({}, criteria, {
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
                            fetchBillingClients(Object.assign({}, criteria, {
                                toDate: newValue
                            }))
                        }}
                        showTime={false}
                        label={"To:"} />
                </div>
                <div className="col-md-2 pad">
                    <Field name="clientID"
                        onChange={(event, newValue, oldValue) => {
                            fetchBillingReleases(Object.assign({}, criteria, {
                                clientID: newValue
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
                            fetchiBillingTasks(Object.assign({}, criteria, {
                                releaseID: newValue
                            }))
                        }}
                        component={renderSelect}
                        options={releases}
                        label={'Release:'}
                    />
                </div>
            </div>
        </form>
    }
}

BillingTaskCriteriaForm = reduxForm({
    form: 'billing-task-criteria'
})(BillingTaskCriteriaForm)

export default BillingTaskCriteriaForm
