import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import {NotificationManager} from 'react-notifications'
import {ReleasePlanDateNavBarContainer} from "../../containers/index";
import {ConfirmationDialog} from "../index";

class ReleasePlanList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            sizePerPageList: [{
                text: '6', value: 6
            }],
            sizePerPage: 6,  // which size per page you want to locate as default
        }

        this.state = {
            showTaskDeleteConfirmationDialog: false
        }
    }

    componentDidMount() {

    }

    formatTaskDescription(task) {
        console.log("get the task Description", task.description)
        if (task)
            return task.description
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


    formatTaskName(task, row) {

        let name = ''
        let color = ''


        if (row.release.iteration.iterationType == SC.ITERATION_TYPE_PLANNED) {
            color = '#4172c1'
            name = task.name
        }
        else if (row.release.iteration.iterationType == SC.ITERATION_TYPE_UNPLANNED) {
            name = task.name
            color = '#e52d8c'
        }
        else
            name = task.name

        return <span style={{color: color, display: 'block'}} onClick={() => {
            if (row.release.iteration.iterationType === SC.ITERATION_TYPE_UNPLANNED) {
                NotificationManager.error("Cannot add tasks to 'unplanned' release plans")
            }
            else {
                this.props.history.push("/app-home/release-task-planning")
                this.props.releasePlanSelected(row, this.props.release.rolesInThisRelease)
            }
        }}>{name} </span>
    }

    formatProgress(report) {
        if (report)
            return report.progress + '%'
        return ''
    }

    onDeleteDialogClose() {
        this.setState({
            showTaskDeleteConfirmationDialog: false
        })
    }

    deleteCellButton(cell, row) {
        return (<button className=" pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.setState({showTaskDeleteConfirmationDialog: true, row: row})
                        }}>
            <i className="fa fa-trash"></i>
        </button>)
    }

    onConfirmDeleteRequest() {
        this.setState({showTaskDeleteConfirmationDialog: false})
        this.props.removeReleasePlan(this.state.row._id)
    }

    editCellButton(cell, row, extra) {
        return (extra && row.release.iteration.iterationType != SC.ITERATION_TYPE_ESTIMATED ?
            <button className=" pull-left btn btn-custom" type="button"
                    onClick={() => {
                        this.props.showUpdateReleasePlanForm(row)
                    }}>
                <i className="fa fa-pencil"></i>
            </button> : '')
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
                            src="/images/planned_beyond_release_date.png"
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
                            src="/images/pending-on-enddate.png"
                            title="Pending On Enddate"/>
            else if (flag === SC.WARNING_COMPLETED_BEFORE_END_DATE)
                return <img className="div-hover releasePlanFlagImg" key={"completed-before-enddate" + idx}
                            src="/images/completed_before_enddate.png"
                            title="Completed Before Enddate"/>
            else if (flag === SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
                return <img className="div-hover releasePlanFlagImg" key={"employee-ask-for-leave"}
                            src="/images/employee-ask-for-leave.png"
                            title="Employee Ask For Leave"/>
            else return ''
        }) : null
        return <span>{flagImageArray}</span>

    }

    render() {
        let team = 0
        const {release, releasePlans, releasePlanFilters, loggedInUser} = this.props
        let isManager = loggedInUser && loggedInUser._id && release.manager._id && loggedInUser._id.toString() === release.manager._id.toString() ? true : false


        return (
            <div>

                <ConfirmationDialog show={this.state.showTaskDeleteConfirmationDialog}
                                    onConfirm={this.onConfirmDeleteRequest.bind(this)}
                                    title="Release-Task Delete" onClose={this.onDeleteDialogClose.bind(this)}
                                    body="Are you sure you want to delete this task plan. Please confirm!"/>

                <div key={"release-plan-search"} className="col-md-12 release-options">
                    <button type="button" className="col-md-2 btn customBtn" onClick={
                        () => {
                            this.props.showAddToReleasePlanForm(release)
                        }}>Add Task
                    </button>
                </div>
                <div>
                    <ReleasePlanDateNavBarContainer/>
                </div>

                {releasePlanFilters.expandDescription ?
                    <div key={"releaseplan-table"} className="col-md-12 estimation wrapTextTable">
                        <BootstrapTable options={this.options} data={releasePlans}
                                        multiColumnSearch={true}
                                        search={false}
                                        striped={true}
                                        pagination
                                        hover={true}
                                        height={"300px"}>
                            <TableHeaderColumn columnTitle isKey dataField='_id'
                                               hidden={true}>ID</TableHeaderColumn>

                            <TableHeaderColumn width="25%" dataField='task'
                                               dataFormat={this.formatTaskName.bind(this)}>Task
                                Name</TableHeaderColumn>

                            <TableHeaderColumn width={"50%"} columnTitle dataField='task'
                                               dataFormat={this.formatTaskDescription.bind(this)}>Task Description
                            </TableHeaderColumn>
                            <TableHeaderColumn width="25%" columnTitle dataField='task'
                                               dataFormat={this.formatEstimatedHours.bind(this)} dataAlign={"right"}>Estimated
                                Hours</TableHeaderColumn>

                        </BootstrapTable>

                    </div> : <div key={"releaseplan-table"} className="col-md-12 estimation" style = {{height: releasePlans.length > 6 ? 40 + 6 * 51.20+'px': 40 + releasePlans.length * 51.20 +'px', marginBottom:'54px'}}>
                        <BootstrapTable options={this.options} data={releasePlans}
                                        multiColumnSearch={true}
                                        search={false}
                                        striped={true}
                                        pagination
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id'
                                               hidden={true}>ID</TableHeaderColumn>

                            <TableHeaderColumn width="20%" dataField='task'
                                               dataFormat={this.formatTaskName.bind(this)}>Task
                                Name</TableHeaderColumn>

                            <TableHeaderColumn width="12%" columnTitle dataField='report'
                                               dataFormat={this.formatProgress.bind(this)}
                                               dataAlign={"right"}>Progress</TableHeaderColumn>
                            <TableHeaderColumn width="15%" dataField='flags'
                                               dataFormat={this.formatFlags.bind(this)}>
                                Flag</TableHeaderColumn>
                            <TableHeaderColumn width="12%" columnTitle dataField='task'
                                               dataFormat={this.formatEstimatedHours.bind(this)}
                                               dataAlign={"right"}>Estimated </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='planning'
                                               dataFormat={this.formatPlannedHours.bind(this)} dataAlign={"right"}>Planned
                            </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='report'
                                               dataFormat={this.formatReportedHours.bind(this)} dataAlign={"right"}>Reported
                            </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='report'
                                               dataFormat={this.formatReportedStatus.bind(this)} dataAlign={"center"}>Status
                            </TableHeaderColumn>
                            <TableHeaderColumn width="5%" columnTitle dataField='_id'
                                               formatExtraData={isManager} dataFormat={this.editCellButton.bind(this)}
                                               dataAlign={"center"} dateField={"button"}>
                                <i className="fa fa-pencil"></i>
                            </TableHeaderColumn>
                            <TableHeaderColumn width="5%" columnTitle dataField='_id'
                                               dataFormat={this.deleteCellButton.bind(this)} dataAlign={"center"}
                                               dataField={"button"}>
                                <i className="fa fa-trash"></i>
                            </TableHeaderColumn>
                        </BootstrapTable>

                    </div>}
            </div>
        )
    }
}

export default withRouter(ReleasePlanList)
