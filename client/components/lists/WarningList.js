import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReleaseTaskSearchFormContainer} from '../../containers'

class WarningList extends Component {

    constructor(props) {
        super(props);
    }

    formatTaskName(task) {
        if (task)
            return task.name
        return ''
    }


    formatFlags(flag) {
        if (flag === SC.WARNING_UNPLANNED)
            return <img className="div-hover releasePlanFlagImg" key={"unplanned"} src="/images/unplanned.png"
                        title="Unplanned"/>
        else if (flag === SC.WARNING_TOO_MANY_HOURS)
            return <img className="div-hover releasePlanFlagImg" key={"too_many_hours"}
                        src="/images/too_many_hours.png"
                        title="Too Many Hours"/>
        else if (flag === SC.WARNING_EMPLOYEE_ON_LEAVE)
            return <img className="div-hover releasePlanFlagImg" key={"employee-on-leave"}
                        src="/images/employee_on_leave.png"
                        title="Employee On Leave"/>
        else if (flag === SC.WARNING_RELEASE_DATE_MISSED_1)
            return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_1"}
                        src="/images/release_date_missed_1.png"
                        title="Release Date Missed 1"/>
        else if (flag === SC.WARNING_RELEASE_DATE_MISSED_2)
            return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_2"}
                        src="/images/release_date_missed_2.png"
                        title="Release Date Missed 2"/>
        else if (flag === SC.WARNING_RELEASE_DATE_MISSED_3)
            return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_3"}
                        src="/images/release_date_missed_3.png"
                        title="Release Date Missed 3"/>
        else if (flag === SC.WARNING_RELEASE_DATE_MISSED_4)
            return <img className="div-hover releasePlanFlagImg" key={"release_date_missed_4"}
                        src="/images/release_date_missed_4.png"
                        title="Release Date Missed 4"/>
        else if (flag === SC.WARNING_PLANNED_BEYOND_RELEASE_DATE)
            return <img className="div-hover releasePlanFlagImg" key={"planned_beyond_release_date"}
                        src="/images/pending_after_enddate.png"
                        title="Planned Beyond Release Date"/>
        else if (flag === SC.WARNING_LESS_PLANNED_HOURS)
            return <img className="div-hover releasePlanFlagImg" key={"less_planned_hours"}
                        src="/images/less_planned_hours.png"
                        title="Less Planned Hours"/>
        else if (flag === SC.WARNING_MORE_PLANNED_HOURS)
            return <img className="div-hover releasePlanFlagImg" key={"more_planned_hours"}
                        src="/images/more_planned_hours.png"
                        title="More Planned Hours"/>
        else if (flag === SC.WARNING_MORE_REPORTED_HOURS_1)
            return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_1"}
                        src="/images/more_reported_hours_1.png"
                        title="More Reported Hours 1"/>
        else if (flag === SC.WARNING_MORE_REPORTED_HOURS_2)
            return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_2"}
                        src="/images/more_reported_hours_2.png"
                        title="More Reported Hours 2"/>
        else if (flag === SC.WARNING_MORE_REPORTED_HOURS_3)
            return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_3"}
                        src="/images/more_reported_hours_3.png"
                        title="More Reported Hours 3"/>
        else if (flag === SC.WARNING_MORE_REPORTED_HOURS_4)
            return <img className="div-hover releasePlanFlagImg" key={"more_reported_hours_4"}
                        src="/images/more_reported_hours_4.png"
                        title="More Reported Hours 4"/>
        else if (flag === SC.WARNING_HAS_UNREPORTED_DAYS)
            return <img className="div-hover releasePlanFlagImg" key={"has-unreported-days"}
                        src="/images/has_unreported_days.png"
                        title="Has Unreported Days"/>
        else if (flag === SC.WARNING_UNREPORTED)
            return <img className="div-hover releasePlanFlagImg" key={"unreported"}
                        src="/images/unreported.png"
                        title="Unreported"/>
        else if (flag === SC.WARNING_PENDING_ON_END_DATE)
            return <img className="div-hover releasePlanFlagImg" key={"pending-on-enddate"}
                        src="/images/pending_after_enddate.png"
                        title="Pending On Enddate"/>
        else if (flag === SC.WARNING_COMPLETED_BEFORE_END_DATE)
            return <img className="div-hover releasePlanFlagImg" key={"completed-before-enddate"}
                        src="/images/completed_before_enddate.png"
                        title="Completed Before Enddate"/>
        else if (flag === SC.WARNING_EMPLOYEE_ASK_FOR_LEAVE)
            return <img className="div-hover releasePlanFlagImg" key={"employee-ask-for-leave"}
                        src="/images/employee-ask-for-leave.png"
                        title="Employee Ask For Leave"/>

    }

    formatReleases(releases) {
        if (releases && releases.length > 0)
            return releases.map(release => release.project && release.project.name ? release.project.name : "project").join(", ")
        else
            return ''
    }

    formatReleasePlans(releasePlans) {
        if (releasePlans && releasePlans.length > 0)
            return releasePlans.map(releasePlan => releasePlan.task && releasePlan.task.name ? releasePlan.task.name : "releasePlan").join(", ")
        else
            return ''
    }


    render() {
        const {warnings} = this.props
        return (
            <BootstrapTable options={this.options} data={warnings}
                            multiColumnSearch={true}
                            search={true}
                            striped={true}
                            hover={true}>
                <TableHeaderColumn columnTitle isKey dataField='_id'
                                   hidden={true}>ID
                </TableHeaderColumn>
                <TableHeaderColumn width="20%" columnTitle dataField='type'>Warning
                </TableHeaderColumn>
                <TableHeaderColumn width="12%" columnTitle dataField='type'
                                   dataFormat={this.formatFlags.bind(this)}>Warning Flag
                </TableHeaderColumn>
                <TableHeaderColumn width="15%" columnTitle dataField='releases'
                                   dataFormat={this.formatReleases.bind(this)}>Projects
                </TableHeaderColumn>
                <TableHeaderColumn columnTitle dataField='releasePlans'
                                   dataFormat={this.formatReleasePlans.bind(this)}>Tasks
                </TableHeaderColumn>

            </BootstrapTable>
        )
    }
}

export default withRouter(WarningList)
