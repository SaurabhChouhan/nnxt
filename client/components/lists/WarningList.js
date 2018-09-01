import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'


const ReleasePlanFormat = (props) => {
    if (props.releasePlans && props.releasePlans.length > 0)
        return props.releasePlans.map(releasePlan => {
            if (releasePlan.task) {
                if (releasePlan.source)
                    return <span className={"source"}>{releasePlan.task.name}</span>
                else
                    return <span>{releasePlan.task.name}</span>
            }
        })
    else
        return ''
}

const ReleaseFormat = (props) => {
    if (props.releases && props.releases.length > 0)
        return props.releases.map(release => {
            if (release.project) {
                if (release.source)
                    return <span className={"source"}>{release.project.name}</span>
                else
                    return <span>{release.project.name}</span>
            }
        })
    else
        return ''
}


class WarningList extends Component {

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
        this.props.getAllWarnings(this.props.release)
    }

    formatFlag(flag) {
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
                        src="/images/planned_beyond_release_date.png"
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
                        src="/images/pending-on-enddate.png"
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
        return <ReleaseFormat releases={releases}/>
    }


    formatReleasePlans(releasePlans) {
        return <ReleasePlanFormat releasePlans={releasePlans}/>
    }

    warningSourceClassFormat(fieldValue, row) {
        return row.type == SC.WARNING_TOO_MANY_HOURS ? 'warningSource' : 'noWarningSource'
    }

    render() {
        const {warnings, release} = this.props

        return ([
            <div key={"warning-search"} className="col-md-12 release-options">

                <div className="search-btn-container">
                    <select className="form-control" title="Select Flag" onChange={(flag) =>
                        this.props.fetchWarningOnFlags(flag.target.value, release)
                    }>
                        <option value={SC.ALL}>All Flags</option>
                        {SC.ALL_WARNING_NAME_ARRAY.map((warning, idx) => <option
                            key={warning + idx} value={warning}>{warning}</option>)}

                    </select>
                </div>
            </div>,
            <div key={"warning-table"} className="col-md-12 estimation release-plan-table">
                <BootstrapTable options={this.options} data={warnings}
                                multiColumnSearch={true}
                                search={false}
                                striped={true}
                                pagination
                                hover={true}
                                height={"300px"}>
                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                       hidden={true}>ID
                    </TableHeaderColumn>
                    <TableHeaderColumn width="20%" columnTitle dataField='type'>Warning
                    </TableHeaderColumn>
                    <TableHeaderColumn width="12%" columnTitle dataField='type'
                                       dataFormat={this.formatFlag.bind(this)}>Warning Flag
                    </TableHeaderColumn>
                    <TableHeaderColumn width="15%" columnClassName={this.warningSourceClassFormat} columnTitle dataField='releases'
                                       dataFormat={this.formatReleases.bind(this)}>Projects
                    </TableHeaderColumn>
                    <TableHeaderColumn columnClassName={this.warningSourceClassFormat} dataField='releasePlans'
                                       dataFormat={this.formatReleasePlans.bind(this)}>Tasks
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>])
    }
}

export default withRouter(WarningList)
