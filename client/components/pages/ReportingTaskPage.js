import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReportingDateNavBarContainer} from '../../containers'
import {withRouter} from 'react-router-dom'


class ReportingTaskPage extends Component {

    constructor(props) {
        super(props)
        this.onReportedStatusChange = this.onReportedStatusChange.bind(this)
        this.onReleaseSelect = this.onReleaseSelect.bind(this)
    }

    rowClassNameFormat(row, rowIdx) {
        return row.status === SC.STATUS_COMPLETED ? 'td-row-completed' : row.status === SC.STATUS_PENDING ? 'td-row-pending' : 'td-row-unreported';
    }

    formatManager(row) {
        if (row) {
            return row.firstName + ' ' + row.lastName
        }
        return ''

    }

    formatLeader(row) {
        if (row) {
            return row.firstName + ' ' + row.lastName
        }
        return ''
    }

    formatTask(cell, row) {
        if (row.task && row.task.name)
            return row.task.name
        return ''
    }

    formatPlannedHours(cell, row) {
        if (row.planning && row.planning.plannedHours)
            return row.planning.plannedHours
        return ''
    }

    formatReportedStatus(cell, row) {
        if (cell)
            return cell
        else if (row.report && row.report.status) {
            row.status = row.report.status
            return row.report.status
        }
        return SC.REPORT_UNREPORTED
    }

    formatReportedHours(cell, row) {
        if (cell)
            return cell
        else if (row.report && row.report.reportedHours) {
            row.reportedHours = row.report.reportedHours
            return row.report.reportedHours
        }
        return ''
    }

    viewEditButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom" type="button" onClick={() => {
                console.log('edit')
            }}>
                <i className="fa fa-pencil"></i>
            </button>
        )
    }

    viewSubmitButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.props.reportTask(row, this.props.dateOfReport)
            }}>
                <i className="fa fa-check"></i>
            </button>
        )
    }

    viewDetailButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.props.taskSelected(row).then(json => {
                    if (json.success) {
                        this.props.history.push('/app-home/reporting-task-detail')
                        this.props.showTaskDetailPage()
                    }
                    return json
                })
            }}>
                <i className="fa fa-eye"></i>
            </button>
        )
    }

    onReportedStatusChange(status) {
        this.props.onReleaseSelect(this.props.releaseID, this.props.dateOfReport, status)
        this.props.setStatus(status)
    }

    onReleaseSelect(releaseID) {
        this.props.onReleaseSelect(releaseID, this.props.dateOfReport, this.props.reportedStatus)
    }

    render() {

        const {allReleases, releases, reportedStatus,releaseID} = this.props
        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }
        console.log("releases", releases)
        return (
            <div key="estimation_list" className="clearfix">

                <div className="col-md-12">
                    <ReportingDateNavBarContainer taskStatus={taskStatus} releaseID={releases}/>
                </div>
                <div className="col-md-12">

                    <div className="col-md-8 releaseOption releaseDetailSearchContent">

                        <div className="col-md-6 ">
                            <div>
                                <select
                                    value={}
                                    className="form-control"
                                    title="Select Flag"
                                    onChange={(project) =>
                                        this.onReleaseSelect(project.target.value)
                                    }>

                                    <option key={SC.ALL} value={SC.ALL}>All Project</option>
                                    {
                                        allReleases && allReleases.length ? allReleases.map((release, idx) =>
                                            <option
                                                key={idx}
                                                value={release._id}>
                                                {release.project.name} ({release.name})
                                            </option>) : null
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div>
                                <select
                                    className="form-control"
                                    title="Select Status"
                                    value={taskStatus}
                                    onChange={(status) => this.onTaskStatusChange(status.target.value)}>
                                    <option key={SC.ALL} value={SC.ALL}>All Task Status</option>
                                    <option key={SC.REPORT_UNREPORTED}
                                            value={SC.REPORT_UNREPORTED}>{SC.REPORT_UNREPORTED}</option>
                                    <option key={SC.REPORT_PENDING}
                                            value={SC.REPORT_PENDING}>{SC.REPORT_PENDING}</option>
                                    <option key={SC.REPORT_COMPLETED}
                                            value={SC.REPORT_COMPLETED}>{SC.REPORT_COMPLETED}</option>


                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="estimation">
                        {
                            releases && releases.length ? releases.map((release, idx) =>
                                    <div>
                                        {
                                            release && release._id && <div className="col-md-12 releaseHeader">
                                                <div className="col-md-3">
                                                    <div className="releaseTitle">
                            <span
                                title={release.project ? release.project.name : ''}>Project Name</span>
                                                    </div>
                                                    <div className="releasecontent">
                                                        <p>{release.project ? release.project.name + ' (' + release.name + ')' : ''}</p>
                                                    </div>
                                                </div>

                                                <div className="col-md-2">
                                                    <div className="releaseTitle">
                                                        <span>Start Date</span>
                                                    </div>
                                                    <div className="releasecontent">
                                                        <p>{release.iterations && release.iterations[0].devStartDate ? moment(release.iterations[0].devStartDate).format('DD-MM-YYYY') : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="releaseTitle">
                                                        <span>End Date</span>
                                                    </div>
                                                    <div className="releasecontent">
                                                        <p>{release.iterations && release.iterations[0].devEndDate ? moment(release.iterations[0].devEndDate).format('DD-MM-YYYY') : ''}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="releaseTitle">
                                                        <span>Release Date</span>
                                                    </div>
                                                    <div className="releasecontent">
                                                        <p>{release.iterations && release.iterations[0].clientReleaseDate ? moment(release.iterations[0].clientReleaseDate).format('DD-MM-YYYY') : ''}</p>
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
                                        }
                                        <BootstrapTable options={this.options}
                                                        data={release.tasks && release.tasks.length > 0 ? release.tasks : []}
                                                        striped={true}
                                                        hover={true}
                                                        trClassName={this.rowClassNameFormat.bind(this)}
                                                        cellEdit={cellEditProp}>

                                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                                            </TableHeaderColumn>
                                            <TableHeaderColumn editable={false} width="10%" columnTitle={'View Detail'}
                                                               dataField='detailButton'
                                                               dataFormat={this.viewDetailButton.bind(this)}>View Detail
                                            </TableHeaderColumn>
                                            <TableHeaderColumn editable={false} width="20%" columnTitle dataField="task"
                                                               dataFormat={this.formatTask}
                                                               dataSort={true}>
                                                Task Name</TableHeaderColumn>
                                            <TableHeaderColumn width="12%" columnTitle dataField="planning"
                                                               dataFormat={this.formatPlannedHours} editable={false}
                                            > planned hours</TableHeaderColumn>
                                            <TableHeaderColumn width="15%" columnTitle dataField="reportedHours"
                                                               dataFormat={this.formatReportedHours}
                                                               editable={{
                                                                   type: 'select',
                                                                   options: {
                                                                       values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                                                                   }
                                                               }}
                                            >Worked Hours</TableHeaderColumn>
                                            <TableHeaderColumn width="15%" columnTitle dataField="status"
                                                               editable={{
                                                                   type: 'select',
                                                                   options: {
                                                                       values: [SC.REPORT_PENDING, SC.REPORT_COMPLETED]
                                                                   }
                                                               }} dataFormat={this.formatReportedStatus}>Reported
                                                Status</TableHeaderColumn>
                                            <TableHeaderColumn editable={false} width="5%" columnTitle={'Edit Report'}
                                                               dataField="Edit Report"
                                                               dataFormat={this.viewEditButton.bind(this)}>Edit
                                            </TableHeaderColumn>
                                            <TableHeaderColumn editable={false} width="7%" columnTitle={'Submit Report'}
                                                               dataField="Submit Report"
                                                               dataFormat={this.viewSubmitButton.bind(this)}>Submit
                                            </TableHeaderColumn>
                                        </BootstrapTable>

                                    </div>
                            ) : null}
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(ReportingTaskPage)


{/*
  <TableHeaderColumn width="12%" columnTitle dataField="reason"
                                               editable={{
                                                   type: 'select',
                                                   options: {
                                                       values: [SC.REASON_GENERAL_DELAY, SC.REASON_EMPLOYEE_ON_LEAVE, SC.REASON_INCOMPLETE_DEPENDENCY, SC.REASON_NO_GUIDANCE_PROVIDED, SC.REASON_RESEARCH_WORK, SC.REASON_UNFAMILIAR_TECHNOLOGY]
                                                   }
                                               }}>Reason
                                Code</TableHeaderColumn>
*/
}