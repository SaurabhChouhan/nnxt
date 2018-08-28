import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReleaseTaskSearchFormContainer} from '../../containers'

class TaskPlanList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            sizePerPageList: [{
                text: '6', value: 6
            }, {
                text: '10', value: 10
            }, {
                text: '20', value: 20
            }, {
                text: '50', value: 50
            }],
            sizePerPage: 6,  // which size per page you want to locate as default

        }
    }

    componentDidMount() {
        this.props.getAllTaskPlans(this.props.release)
    }

    formatDeveloperName(employee) {
        if (employee)
            return employee.name
        return ''
    }

    formatTaskName(task, row) {
        if (task) {
            if (row.iterationType == SC.ITERATION_TYPE_PLANNED)
                return <span style={{color: '#4172c1'}}>{task.name}</span>
            else if (row.iterationType == SC.ITERATION_TYPE_UNPLANNED)
                return <span style={{color: '#e52d8c'}}>{task.name}</span>
            else
                return <span>{task.name}</span>
        }
        return ''
    }

    formatPlannedHours(planning) {
        console.log("Planning---------------", planning)
        if (planning)
            return planning.plannedHours
        return 0
    }

    formatPlannedDate(row) {
        if (row) {
            return moment(row).format(SC.DATE_DISPLAY_FORMAT)
        }
        return ''
    }

    formatReportedStatus(report) {
        if (report)
            return report.status
        return ''
    }

    formatReportedHours(report) {
        if (report)
            return report.reportedHours
        return 0
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
        const {taskPlans} = this.props
        console.log("taskPlans------------------", taskPlans)

        return (
            <div className="col-md-12 estimation release-plan-table">
                <BootstrapTable options={this.options} data={taskPlans}
                                multiColumnSearch={true}
                                search={false}
                                striped={true}
                                pagination
                                hover={true}
                                height={"300px"}>
                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                       hidden={true}>ID
                    </TableHeaderColumn>
                    <TableHeaderColumn width={"20%"} columnTitle dataField='task'
                                       dataFormat={this.formatTaskName.bind(this)}>Tasks
                    </TableHeaderColumn>
                    <TableHeaderColumn width={"20%"} columnTitle dataField='employee'
                                       dataFormat={this.formatDeveloperName.bind(this)}>Developer
                    </TableHeaderColumn>
                    <TableHeaderColumn width="18%" dataField='flags'
                                       dataFormat={this.formatFlags.bind(this)}>
                        Flag</TableHeaderColumn>
                    <TableHeaderColumn columnTitle width={"12%"} dataField='planningDate'
                                       dataFormat={this.formatPlannedDate.bind(this)}>Planning
                        Date
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle width={"10%"} dataField='planning'
                                       dataFormat={this.formatPlannedHours.bind(this)}>Planned
                        Hours
                    </TableHeaderColumn>
                    <TableHeaderColumn width="10%" columnTitle dataField='report'
                                       dataFormat={this.formatReportedHours.bind(this)} dataAlign={"right"}>Reported
                        Hours</TableHeaderColumn>
                    <TableHeaderColumn width="10%" columnTitle dataField='report'
                                       dataFormat={this.formatReportedStatus.bind(this)} dataAlign={"center"}>Status
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>
        )
    }
}

export default withRouter(TaskPlanList)
