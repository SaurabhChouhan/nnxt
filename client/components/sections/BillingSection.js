import React, { Component } from 'react'
import { BILLING_TASK_TAB, BILLING_TIMESHEET_TAB } from '../../clientconstants'

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

        </div>
    }
}

export default BillingSection