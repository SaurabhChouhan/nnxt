import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'
import _ from 'lodash'
import {
    ReleaseDeveloperFilterFormContainer,
    ReleaseDeveloperScheduleFormContainer,
    ReleaseDevelopersSchedulesContainer
} from '../../containers'
import {ConfirmationDialog} from "../";

moment.locale('en')
momentLocalizer()

class ReleaseTaskPlanningPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTaskDeleteConfirmationDialog: false,
            showTaskReopenConfirmationDialog: false,
            row: {}
        };

        this.taskListPageOptions = {
            sizePerPageList: [{
                text: '5', value: 5
            }],
            sizePerPage: 5  // which size per page you want to locate as default
        }

    }


    onClose() {
        this.setState({
            showTaskDeleteConfirmationDialog: false
        })
    }

    closeReopenTaskDialog() {
        this.setState({
            showTaskReopenConfirmationDialog: false
        })
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        if (row.report.reportedOnDate)
            return '' // task is already report cannot delete now
        else return (<button className=" pull-left btn btn-custom" type="button"
                             onClick={() => {
                                 this.setState({showTaskDeleteConfirmationDialog: true, row: row})
                             }}>
            <i className="fa fa-trash"></i>
        </button>)
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        let now = new Date()
        let nowMomentString = moment(now).format(SC.DATE_FORMAT)
        let nowMoment = moment(nowMomentString)
        let planningMoment = moment(row.planningDateString)
        return ''
    }

    reopenCellButton(cell, row, enumObject, rowIndex) {

        // Manager/leader can reopen task having status as completed if they think work is still pending
        if (row.report.status == SC.STATUS_COMPLETED) {
            return (<button className=" pull-left btn btn-custom" type="button"
                            onClick={() => {
                                this.setState({showTaskReopenConfirmationDialog: true, row: row})
                            }}>
                <i className="fa fa-unlock"></i>
            </button>)
        } else
            return ''

    }

    moveCellButton(cell, row) {
        if (row.report.reportedOnDate)
            return '' // task is already report cannot delete now
        else return (<button className=" pull-left btn btn-custom" type="button"
                             onClick={() => {
                                 this.props.openMoveTaskPlanForm(row, this.props.workCalendarEmployeeID)
                             }}>
            <i className="fa fa-cut"></i>
        </button>)
    }

    actionCellButton(cell, row) {
        if (row && row.canMove)
            return (<button className=" btn btn-custom customBtn mergeBtn" type="button"
                            onClick={() => {
                                this.props.openMoveTaskPlanForm(row, this.props.workCalendarEmployeeID)
                            }}>Move</button>)
        else return ''
    }

    formatPlanningDate(row) {
        if (row && !_.isEmpty(row)) {
            return moment(row, SC.DATE_FORMAT).format(SC.DATE_DISPLAY_FORMAT)
            //return row
        }
        return ''
    }

    formatPlannedHours(planning) {
        if (planning && planning.plannedHours)
            return Number(planning.plannedHours)
        else return 0
    }

    formatDeveloper(developer) {
        if (developer && developer.name) {
            return developer.name
        }
        return ''
    }

    formatReport(report) {
        if (report && report.status) {
            return report.status
        }
        return ''
    }

    formatReportHours(report) {
        if (report && report.reportedHours) {
            return report.reportedHours
        }
        return ''
    }

    formatTaskName(task) {
        if (task && task.name) {
            return task.name
        }
        return ''
    }

    onConfirmDeleteRequest() {
        this.setState({showTaskDeleteConfirmationDialog: false})
        this.props.deleteTaskPlanningRow(this.state.row, this.props.workCalendarEmployeeID)
    }

    reopenTask() {
        this.setState({showTaskReopenConfirmationDialog: false})
        this.props.reopenTask(this.state.row)
    }

    formatFlags(flags) {
        let flagImageArray = flags && flags.length ? flags.map((flag, idx) => {
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

        const {releasePlan, taskPlans, developerPlans, expanded, release, workCalendarEmployeeID} = this.props
        return (
            <div>
                <div className="col-md-8 pad">
                    <div className="col-md-12 estimateheader">
                        <div className="col-md-6 pad">
                            <div className="backarrow">
                                <h5>
                                    <button className="btn-link" title="Go Back" onClick={() => {
                                        this.props.history.push("/app-home/release-plan")
                                        this.props.ReleaseTaskGoBack(release)
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                                    <b title={releasePlan && releasePlan.task ? releasePlan.task.name : ''}>{releasePlan.task ? releasePlan.task.name : ''} </b>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2 ">
                            <button
                                className=" btn refreshBtn "
                                type="button"
                                onClick={() => {
                                    this.props.refreshSelectedTaskPlan(releasePlan, releasePlan.rolesInThisRelease)
                                }}>
                                <i className="fa fa-refresh "></i>
                            </button>
                        </div>
                        <div className="col-md-2  releaseClock ">
                            <i className="fa fa-clock-o "
                               title="Estimated Hours"></i><b>{releasePlan && releasePlan.task ? releasePlan.task.estimatedHours : ''}
                            Hrs</b>
                        </div>
                        <div className="col-md-2  releaseClock releasePlannedHrs">
                            <i className="fa fa-clock-o "
                               title="Planned Hours"></i><b>{releasePlan && releasePlan.planning ? releasePlan.planning.plannedHours : ''}
                            Hrs</b>
                        </div>
                    </div>
                    <div className="col-md-12 ">
                        <div className={expanded ? "expanded-release-content" : 'release-content'}>
                            <p className="task-description ">{releasePlan && releasePlan.task ? releasePlan.task.description : ''}</p>
                            {expanded ? <label className="div-hover releaseReadLessLabel releaseReadLessLabelClick"
                                               onClick={() => this.props.expandDescription(false)}>...Read
                                Less</label> : <label className="div-hover releaseReadMoreLabel"
                                                      onClick={() => this.props.expandDescription(true)}>...Read
                                More</label>}
                        </div>
                    </div>
                    <div className="col-md-12 releasePlanChkBtn">
                        <div className="col-md-4 planchk">
                        </div>
                        <div className="col-md-4 planBtn">
                            <button type="button" className="btn releasePlanTaskbtn"
                                    onClick={() => this.props.showTaskPlanningCreationForm(releasePlan, workCalendarEmployeeID)}>
                                <i className="fa fa-plus-circle"></i>
                                Plan Task
                            </button>
                        </div>

                    </div>
                    <div className="col-md-12">
                        <div className="estimation">
                            <BootstrapTable options={this.options} data={taskPlans}
                                            striped={true}
                                            hover={true}
                                            height={"300px"}
                                            options={this.taskListPageOptions}
                                            pagination
                            >
                                <TableHeaderColumn columnTitle isKey dataField='_id'
                                                   hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planningDateString'
                                                   width={"10%"}
                                                   dataFormat={this.formatPlanningDate.bind(this)}>Date</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   width={"9%"}
                                                   dataFormat={this.formatPlannedHours.bind(this)} dataAlign={"center"}>Planned</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='employee'
                                                   dataFormat={this.formatDeveloper.bind(this)}
                                                   width={"18%"}>Developer</TableHeaderColumn>
                                <TableHeaderColumn dataField='flags'
                                                   dataFormat={this.formatFlags.bind(this)} width={"12%"}>Flags
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReport.bind(this)} width={"12%"} dataAlign={"center"}>Status
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReportHours.bind(this)} width={"9%"} dataAlign={"center"}>Reported
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle={"Delete Task"} width="7%" dataField='button'
                                                   dataFormat={this.deleteCellButton.bind(this)} dataAlign={"center"}><i
                                    className="fa fa-trash"></i>
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle={"Edit Task"} width="7%" dataField='button'
                                                   dataFormat={this.editCellButton.bind(this)} dataAlign={"center"}><i
                                    className="fa fa-pencil"></i>
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle={"Move"} width="9%" dataField='button'
                                                   dataFormat={this.moveCellButton.bind(this)} dataAlign={"center"}><i
                                    className="fa fa-cut"></i>
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle={"Reopen Task"} width="7%" dataField='button'
                                                   dataFormat={this.reopenCellButton.bind(this)} dataAlign={"center"}><i
                                    className="fa fa-unlock"></i>
                                </TableHeaderColumn>


                            </BootstrapTable>
                            {
                                this.state && this.state.showTaskDeleteConfirmationDialog &&
                                <ConfirmationDialog show={true}
                                                    onConfirm={this.onConfirmDeleteRequest.bind(this)}
                                                    title="Task Delete" onClose={this.onClose.bind(this)}
                                                    body="Are you sure you want to delete this task plan. Please confirm!"/>
                            }
                            {
                                this.state && this.state.showTaskReopenConfirmationDialog &&
                                <ConfirmationDialog show={true}
                                                    onConfirm={this.reopenTask.bind(this)}
                                                    title="Task Reopen" onClose={this.closeReopenTaskDialog.bind(this)}
                                                    body="This will mark task as 'pending' again. Please confirm."/>
                            }
                        </div>
                    </div>
                    <div>
                        <ReleaseDeveloperFilterFormContainer/>
                    </div>
                    <div className="col-md-12">
                        <div className="estimation">
                            <BootstrapTable options={this.options} data={developerPlans}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id'
                                                   hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planningDateString'
                                                   dataFormat={this.formatPlanningDate.bind(this)}>
                                    Date
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'
                                                   dataFormat={this.formatTaskName.bind(this)}>
                                    Task Name
                                </TableHeaderColumn>
                                <TableHeaderColumn width="25%" columnTitle dataField='employee'
                                                   dataFormat={this.formatDeveloper.bind(this)}>
                                    Developer
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   dataFormat={this.formatPlannedHours.bind(this)}>
                                    Planned Effort
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReport.bind(this)}>
                                    Reported
                                </TableHeaderColumn>
                                <TableHeaderColumn width="12%" dataField='button'
                                                   dataFormat={this.actionCellButton.bind(this)}>
                                    <i className="fa fa-plus"></i>
                                </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 estimationsection pad">
                    <div>
                        <ReleaseDeveloperScheduleFormContainer/>
                    </div>
                    <ReleaseDevelopersSchedulesContainer/>
                </div>
            </div>
        )
    }
}

ReleaseTaskPlanningPage.defaultProps = {
    expanded: false
}
export default withRouter(ReleaseTaskPlanningPage)
