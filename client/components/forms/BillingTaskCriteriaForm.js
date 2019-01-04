import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderSelect } from '../forms/fields'

class BillingTaskCriteriaForm extends Component {
    render() {
        let { clients, clientSelected, releases } = this.props
        return <form>
            <div className="col-md-12">
                <div className="col-md-2 pad">
                    <Field name="client._id"
                        onChange={(event, newValue, oldValue) => {
                            clientSelected(newValue)
                        }}
                        label={'Client:'}
                        component={renderSelect}
                        showNoneOption={true}
                        options={clients}
                    />
                </div>
                <div className="col-md-2">
                    <Field name="releaseTypes"
                        onChange={(event, newValue, oldValue) => {

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
