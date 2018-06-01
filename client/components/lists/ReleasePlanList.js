import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReleaseTaskSearchFormContainer} from '../../containers'

class ReleasePlanList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }
        this.state = {
            status: "all",
            flag: "all",
            showPlans: true
        }
        this.onFlagChange = this.onFlagChange.bind(this)
        this.onStatusChange = this.onStatusChange.bind(this)
        this.showReleasePlans = this.showReleasePlans.bind(this)
        this.showWarnings = this.showWarnings.bind(this)

    }

    showReleasePlans(flag) {
        this.setState({showPlans: true})
    }

    showWarnings(flag) {
        this.setState({showPlans: false})
    }

    onFlagChange(flag) {
        this.setState({flag: flag})
        this.props.changeReleaseFlag(this.props.release, this.state.status, flag)
    }


    onStatusChange(status) {
        this.setState({status: status})
        this.props.changeReleaseStatus(this.props.release, status, this.state.flag)
    }

    onRowClick(row) {
        this.props.history.push("/app-home/release-task-planning")
        this.props.releasePlanSelected(row, this.props.release.highestRoleInThisRelease)
    }

    formatDate(row) {
        if (row) {
            return moment(row).format("DD-MM-YYYY")
        }
        return ''
    }

    formatEstimatedHours(task) {
        if (task)
            return task.estimatedHours
        return 0
    }

    formatPlannedHours(planning) {
        if (planning)
            return planning.plannedHours
        return 0
    }

    formatReportedHours(report) {
        if (report)
            return report.reportedHours
        return 0
    }

    formatReportedStatus(report) {
        if (report)
            return report.finalStatus
        return 'unplanned'
    }


    formatTaskName(task) {
        if (task)
            return task.name
        return ''
    }


    formatFlags(flags) {
        let flagImageArray = []
        flagImageArray = flags && flags.length ? flags.map((flag, idx) => {
            if (flag === SC.WARNING_UNPLANNED)
                return <img className="div-hover releasePlanFlagImg" key={"unplanned" + idx} src="/images/unplanned.png"
                            title="Unplanned"/>
            else if (flag === SC.WARNING_TOO_MANY_HOURS)
                return <img className="div-hover releasePlanFlagImg" key={"too_many_hours" + idx}
                            src="/images/too_many_hours.png"
                            title="Too Many Hours"/>
            else if (flag === SC.WARNING_EMPLOYEE_ON_LEAVE)
                return <img className="div-hover releasePlanFlagImg" key={"employee-on-leave" + idx}
                            src="/images/employee_on_leave.png"
                            title="Employee On Leave"/>
            else if (flag === SC.WARNING_RELEASE_DATE_MISSED_1)
                return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_1" + idx}
                            src="/images/release_date_missed_1.png"
                            title="Release Date Missed 1"/>
            else if (flag === SC.WARNING_RELEASE_DATE_MISSED_2)
                return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_2" + idx}
                            src="/images/release_date_missed_2.png"
                            title="Release Date Missed 2"/>
            else if (flag === SC.WARNING_RELEASE_DATE_MISSED_3)
                return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_3" + idx}
                            src="/images/release_date_missed_3.png"
                            title="Release Date Missed 3"/>
            else if (flag === SC.WARNING_RELEASE_DATE_MISSED_4)
                return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_4" + idx}
                            src="/images/release_date_missed_4.png"
                            title="Release Date Missed 4"/>
            else if (flag === SC.WARNING_PLANNED_BEYOND_RELEASE_DATE)
                return <img className="div-hover releasePlanFlagImg" key={"planned_beyond_release_date" + idx}
                            src="/images/pending_after_enddate.png"
                            title="Planned Beyond Release Date"/>
            else if (flag === SC.WARNING_LESS_PLANNED_HOURS)
                return <img className="div-hover releasePlanFlagImg" key={"less_planned_hours" + idx}
                            src="/images/less_planned_hours.png"
                            title="Less Planned Hours"/>
            else if (flag === SC.WARNING_MORE_PLANNED_HOURS)
                return <img className="div-hover releasePlanFlagImg" key={"more_planned_hours" + idx}
                            src="/images/more_planned_hours.png"
                            title="More Planned Hours"/>
            else if (flag === SC.WARNING_MORE_REPORTED_HOURS_1)
                return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_1" + idx}
                            src="/images/more_reported_hours_1.png"
                            title="More Reported Hours 1"/>
            else if (flag === SC.WARNING_MORE_REPORTED_HOURS_2)
                return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_2" + idx}
                            src="/images/more_reported_hours_2.png"
                            title="More Reported Hours 2"/>
            else if (flag === SC.WARNING_MORE_REPORTED_HOURS_3)
                return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_3" + idx}
                            src="/images/more_reported_hours_3.png"
                            title="More Reported Hours 3"/>
            else if (flag === SC.WARNING_MORE_REPORTED_HOURS_4)
                return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_4" + idx}
                            src="/images/more_reported_hours_4.png"
                            title="More Reported Hours 4"/>
            else if (flag === SC.WARNING_HAS_UNREPORTED_DAYS)
                return <img className="div-hover releasePlanFlagImg" key={"has-unreported-days" + idx}
                            src="/images/has_unreported_days.png"
                            title="Has Unreported Days"/>
            else if (flag === SC.WARNING_UNREPORTED)
                return <img className="div-hover releasePlanFlagImg" key={"unreported" + idx}
                            src="/images/unreported.png"
                            title="Unreported"/>
            else if (flag === SC.WARNING_PENDING_ON_END_DATE)
                return <img className="div-hover releasePlanFlagImg" key={"pending-on-enddate" + idx}
                            src="/images/pending_after_enddate.png"
                            title="Pending On Enddate"/>
            else if (flag === SC.WARNING_COMPLETED_BEFORE_END_DATE)
                return <img className="div-hover releasePlanFlagImg" key={"completed-before-enddate" + idx}
                            src="/images/completed_before_enddate.png"
                            title="Completed Before Enddate"/>
            else return ''
        }) : null
        return <span>{flagImageArray}</span>

    }

    render() {
        let team = 0
        const {release, releasePlans} = this.props
        const {showPlans} = this.state
        return (

            <div key="estimation_list" className="clearfix">

                <div className="col-md-12 releaseHeader">
                    <div className=" col-md-1 backarrow" title="Go Back">
                        <button className="btn-link" onClick={() => {
                            this.props.history.push("/app-home/release")
                            this.props.ReleaseProjectGoBack(release)
                        }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                    </div>
                    <div className="col-md-3">
                        <div className="releaseTitle">
                            <span
                                title={release && release.project && release.project.name ? release.project.name : ''}>Project Name</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.project && release.project.name ? release.project.name : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span
                                title={release && release.initial && release.initial.devStartDate ? moment(release.initial.devStartDate).format("DD-MM-YYYY") : ''}>Start Date</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.initial && release.initial.devStartDate ? moment(release.initial.devStartDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span
                                title={release && release.initial && release.initial.devEndDate ? moment(release.initial.devEndDate).format("DD-MM-YYYY") : ''}>End Date</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.initial && release.initial.devEndDate ? moment(release.initial.devEndDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span
                                title={release && release.initial && release.initial.clientReleaseDate ? moment(release.initial.clientReleaseDate).format("DD-MM-YYYY") : ''}>Release Date</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.initial && release.initial.clientReleaseDate ? moment(release.initial.clientReleaseDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className=" col-md-2 releasefileoption">
                        <ul className="list-unstyled">
                            <li><a href="#"> <i className="fa fa-file-pdf-o"></i></a></li>
                            <li><a href="#"> <i className="fa fa-file-word-o"></i></a></li>
                            <li><a href="#"> <i className=" fa fa-file-excel-o"></i></a></li>
                        </ul>
                    </div>

                </div>
                <div className="col-md-12">
                    <div className="col-md-12">
                        <div className="col-md-2 pad ">
                            <div className="releaseTeamManager"><span>Manager</span>
                            </div>
                            <div className="estimationuser tooltip"><span>M</span>
                                <p className="tooltiptext">{release && release.manager && release.manager.firstName ? release.manager.firstName : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2 pad ">
                            <div className="releaseTeamLeader"><span> Leader</span>
                            </div>
                            <div className="estimationuser tooltip"><span>L</span>
                                <p className="tooltiptext">{release && release.leader && release.leader.firstName ? release.leader.firstName : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-5 pad ">
                            <div className="releaseTeam"><span>Team</span>
                            </div>
                            {
                                release && release.team && Array.isArray(release.team) && release.team.length ? release.team.map((teamMember, index) =>
                                    <div key={"teamMember" + index} className="estimationuser tooltip">
                                        <span>T{index + 1}</span>
                                        <p className="tooltiptext">{teamMember ? teamMember.name : ''}</p>
                                    </div>) : <span></span>
                            }

                        </div>
                        <div className="col-md-3">
                            <div className="col-md-6  releaseClock  releaseProjectPlannedHours">
                                <i className="fa fa-clock-o "
                                   title="Estimated Hours"></i><b>{release.initial ? release.initial.estimatedHours : ''}
                                Hrs</b>
                            </div>
                            <div className="col-md-6  releaseClock releasePlannedHrs releaseProjectPlannedHours">
                                <i className="fa fa-clock-o "
                                   title="Planned Hours"></i><b>{release.initial ? release.initial.plannedHours : ''}
                                Hrs</b>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-12">
                        <button className={showPlans ? "btn btnWarning" : "btn btnWarningSelected"}
                                onClick={() => {
                                    this.showWarnings()
                                }}>Warnings
                        </button>
                        <button className={showPlans ? "btn btnReleasePlanSelected" : "btn btnReleasePlan"}
                                onClick={() => {
                                    this.showReleasePlans()
                                }}>Release Plans
                        </button>
                    </div>
                    <div className="col-md-8 releaseOption releaseDetailSearchContent">

                        <div className="col-md-6 ">
                            <div className="releaseDetailSearchFlag">
                                <select className="form-control" title="Select Flag" onChange={(flag) =>
                                    this.onFlagChange(flag.target.value)
                                }>
                                    <option value="all">All Flags</option>
                                    <option value={SC.WARNING_UNPLANNED}>{SC.WARNING_UNPLANNED}</option>
                                    <option value={SC.WARNING_EMPLOYEE_ON_LEAVE}>{SC.WARNING_EMPLOYEE_ON_LEAVE}</option>
                                    <option
                                        value={SC.WARNING_RELEASE_DATE_MISSED_1}>{SC.WARNING_RELEASE_DATE_MISSED_1}</option>
                                    <option
                                        value={SC.WARNING_RELEASE_DATE_MISSED_2}>{SC.WARNING_RELEASE_DATE_MISSED_2}</option>
                                    <option
                                        value={SC.WARNING_RELEASE_DATE_MISSED_3}>{SC.WARNING_RELEASE_DATE_MISSED_3}</option>
                                    <option
                                        value={SC.WARNING_RELEASE_DATE_MISSED_4}>{SC.WARNING_RELEASE_DATE_MISSED_4}</option>
                                    <option
                                        value={SC.WARNING_HAS_UNREPORTED_DAYS}>{SC.WARNING_HAS_UNREPORTED_DAYS}</option>
                                    <option
                                        value={SC.WARNING_PENDING_ON_END_DATE}>{SC.WARNING_PENDING_ON_END_DATE}</option>
                                    <option
                                        value={SC.WARNING_COMPLETED_BEFORE_END_DATE}>{SC.WARNING_COMPLETED_BEFORE_END_DATE}</option>

                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="releaseDetailSearchStatus">
                                <select className="form-control" title="Select Status"
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
                    </div>

                    <div className="estimation">
                        {showPlans ? <BootstrapTable options={this.options} data={releasePlans}
                                                     multiColumnSearch={true}
                                                     search={true}
                                                     striped={true}
                                                     hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='created' dataFormat={this.formatDate.bind(this)}>Raised
                                </TableHeaderColumn>
                                <TableHeaderColumn width=" 20%" columnTitle dataField='task'
                                                   dataFormat={this.formatTaskName.bind(this)}>Task
                                    Name</TableHeaderColumn>
                                <TableHeaderColumn dataField='flags' dataFormat={this.formatFlags.bind(this)}>
                                    Flag</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'
                                                   dataFormat={this.formatEstimatedHours.bind(this)}>Estimated
                                    Hours</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   dataFormat={this.formatPlannedHours.bind(this)}>Planned
                                    Hours</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReportedHours.bind(this)}>Reported
                                    Hours</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReportedStatus.bind(this)}>Status
                                </TableHeaderColumn>

                            </BootstrapTable> :
                            <BootstrapTable options={this.options} data={releasePlans}
                                            multiColumnSearch={true}
                                            search={true}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id'
                                                   hidden={true}>ID
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'
                                                   dataFormat={this.formatTaskName.bind(this)}>TaskName
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='flags'>Warnings
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='flags'
                                                   dataFormat={this.formatFlags.bind(this)}>Flags
                                </TableHeaderColumn>

                            </BootstrapTable>
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(ReleasePlanList)
