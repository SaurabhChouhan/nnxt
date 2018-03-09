import {Field, reduxForm} from 'redux-form'
import React, {Component} from 'react'
import {renderText} from './fields'
import * as SC from '../../../server/serverconstants'

class ReleaseTaskSearchForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "all",
            flag: "all"
        }
        this.onFlagChange = this.onFlagChange.bind(this)
        this.onStatusChange = this.onStatusChange.bind(this)

    }

    onFlagChange(flag) {
        this.setState({flag: flag})
        this.props.changeReleaseFlag(this.props.release, this.state.status, flag)
    }

    onStatusChange(status) {
        this.setState({status: status})
        this.props.changeReleaseStatus(this.props.release, status, this.state.flag)
    }

    render() {
        const {release} = this.props
        return <form onSubmit={this.props.handleSubmit}>
            <div className="col-md-6 ">
                <div className="searchRelease">
                    <Field name="search" className="form-control" component={renderText}
                           placeholder="Search Task Names"/>
                    <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i>
                    </button>
                </div>
            </div>
            <div className="col-md-3">
                <div>
                    <select className="form-control" onChange={(flag) =>
                        this.onFlagChange(flag.target.value)
                    }>
                        <option value="all">All Flags</option>
                        <option value={SC.FLAG_UNPLANNED}>{SC.FLAG_UNPLANNED}</option>
                        <option value={SC.FLAG_EMPLOYEE_ON_LEAVE}>{SC.FLAG_EMPLOYEE_ON_LEAVE}</option>
                        <option value={SC.FLAG_DEV_DATE_MISSED}>{SC.FLAG_DEV_DATE_MISSED}</option>
                        <option value={SC.FLAG_HAS_UNREPORTED_DAYS}>{SC.FLAG_HAS_UNREPORTED_DAYS}</option>
                        <option
                            value={SC.FLAG_PENDING_AFTER_END_DATE}>{SC.FLAG_PENDING_AFTER_END_DATE}</option>
                        <option
                            value={SC.FLAG_COMPLETED_BEFORE_END_DATE}>{SC.FLAG_COMPLETED_BEFORE_END_DATE}</option>

                    </select>
                </div>
            </div>
            <div className="col-md-3">
                <div>
                    <select className="form-control"
                            onChange={(status) => this.onStatusChange(status.target.value)}>
                        <option value="all">All Status</option>
                        <option value={SC.STATUS_UNPLANNED}>{SC.STATUS_UNPLANNED}</option>
                        <option value={SC.STATUS_PENDING}>{SC.STATUS_PENDING}</option>
                        <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                        <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                        <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
                        <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                        <option value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

                    </select>
                </div>
            </div>
        </form>
    }
}

ReleaseTaskSearchForm = reduxForm({
    form: 'release-task-search'
})(ReleaseTaskSearchForm)

export default ReleaseTaskSearchForm