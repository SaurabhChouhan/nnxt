import React, { Component } from 'react'
import { BILLING_TASK_TAB, BILLING_TIMESHEET_TAB } from '../../clientconstants'
import { BillingTaskCriteriaFormContainer, BillingTaskListContainer } from '../../containers'

let billingData = [{

    estimatedAmount: 300,
    billingAmount: 100,
    earning: 180,
    suggestedBilling: 80,
    taskPlans: [{
        planningDate: '2019-01-05',
        reportedHours: '8.5',
        employeeName: 'Saurabh',
        billingTasks: [{
            billedDate: '2019-01-06',
            billedHours: '8.5',
            billingEmployee: {
                _id: 1,
                name: 'Saurabh'
            },
            timesheetEmployee: {
                _id: 2,
                name: 'Mahesh'
            },
            description: `Use blueprints that are accurately scaled representations
                    of the facilities`

        }]
    }, {
        planningDate: '2019-01-05',
        reportedHours: '8.5',
        employeeName: 'Saurabh',
        billingTasks: [{
            billedDate: '2019-01-06',
            billedHours: '8.5',
            billingEmployee: {
                _id: 1,
                name: 'Saurabh'
            },
            timesheetEmployee: {
                _id: 1,
                name: 'Mahesh'
            },
            description: 'This is the description'
        }, {
            billedDate: '2019-01-06',
            billedHours: '8.5',
            billingEmployee: {
                _id: 2,
                name: 'Saurabh'
            },
            timesheetEmployee: {
                _id: 2,
                name: 'Mahesh'
            },
            description: 'This is the description'
        }]
    }]
}, {
    estimatedAmount: 300,
    billingAmount: 100,
    earning: 180,
    suggestedBilling: 80,
    taskPlans: [{
        planningDate: '2019-01-05',
        reportedHours: '8.5',
        employeeName: 'Saurabh',
        billingTasks: [{
            billedDate: '2019-01-06',
            billedHours: '8.5',
            billingEmployee: {
                _id: 1,
                name: 'Saurabh'
            },
            timesheetEmployee: {
                _id: 2,
                name: 'Mahesh'
            },
            description: 'This is the description'
        }]
    }]
}]

class BillingSection extends Component {
    render() {
        let { selectedTab } = this.props
        return <div style={{ marginTop: '10px' }}>
            <div className="col-md-12 pad">
                <div className="container pad">
                    <ul className="nav nav-tabs">
                        <li className={selectedTab === BILLING_TASK_TAB ? 'active' : ''}>
                            <a
                                data-toggle="tab"
                                className={selectedTab === BILLING_TASK_TAB ? "btn  btn-link btn-size" : "btn  btn-link btn-size"}
                                onClick={() => {

                                }}>Billing
                            </a>
                        </li>
                        <li className={selectedTab === BILLING_TIMESHEET_TAB ? 'active' : ''}>
                            <a
                                data-toggle="tab"
                                className={selectedTab === BILLING_TIMESHEET_TAB ? "btn  btn-link btn-size" : "btn  btn-link btn-size"}
                                onClick={() => {

                                }}>Timesheet
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {selectedTab === BILLING_TASK_TAB && [<BillingTaskCriteriaFormContainer />, <BillingTaskListContainer />]}

        </div>
    }
}

export default BillingSection