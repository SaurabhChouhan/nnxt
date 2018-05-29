import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReportingDateNavBarContainer} from '../../containers'
import {withRouter} from 'react-router-dom'


class ReportingTaskPage extends Component {

    constructor(props) {
        super(props)
        this.onTaskStatusChange = this.onTaskStatusChange.bind(this)
        this.onReleaseSelect = this.onReleaseSelect.bind(this)
    }


    columnClassStatusFormat(status) {
        if (status == SC.STATUS_APPROVED)
            return 'appRowColor'
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

    formatProjectName(project) {
        if (project)
            return project.name
        return ''
    }

    formatCreatedDate(row) {
        if (row) {
            return moment(row).format(SC.DEFAULT_DATE_FORMAT)
        }
        return ''

    }

    formatStartDate(row) {
        if (row) {
            return moment(row.devStartDate).format(SC.DEFAULT_DATE_FORMAT)
        }
        return ''

    }

    formatEndDate(row) {
        if (row) {
            return moment(row.devEndDate).format(SC.DEFAULT_DATE_FORMAT)
        }
        return ''

    }

    formatReleaseDate(row) {
        if (row) {
            return moment(row.clientReleaseDate).format(SC.DEFAULT_DATE_FORMAT)
        }
        return ''

    }

    formatHours(row) {
        if (row) {
            return row.billedHours
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
                this.props.taskSelected(row, this.props.selectedRelease).then(json => {
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

    onTaskStatusChange(status) {
        this.props.onReleaseSelect(this.props.selectedRelease._id, this.props.dateOfReport, status)
        this.props.setStatus(status)
    }

    onReleaseSelect(releaseID) {
        this.props.onReleaseSelect(releaseID, this.props.dateOfReport, this.props.taskStatus)
    }

    render() {

        const {selectedRelease, tasks, releases, taskStatus} = this.props
        const cellEditProp = {
            mode: 'click',
            blurToSave: true
        }

        return (
            <div key="estimation_list" className="clearfix">
                {
                    selectedRelease && selectedRelease._id && <div className="col-md-12 releaseHeader">
                        <div className="col-md-3">
                            <div className="releaseTitle">
                            <span
                                title={selectedRelease.project ? selectedRelease.project.name : ''}>Project Name</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedRelease.project ? selectedRelease.project.name + ' (' + selectedRelease.name + ')' : ''}</p>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="releaseTitle">
                                <span>Start Date</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedRelease.initial && selectedRelease.initial.devStartDate ? moment(selectedRelease.initial.devStartDate).format('DD-MM-YYYY') : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="releaseTitle">
                                <span>End Date</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedRelease.initial && selectedRelease.initial.devEndDate ? moment(selectedRelease.initial.devEndDate).format('DD-MM-YYYY') : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="releaseTitle">
                                <span>Release Date</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedRelease.initial && selectedRelease.initial.clientReleaseDate ? moment(selectedRelease.initial.clientReleaseDate).format('DD-MM-YYYY') : ''}</p>
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
                <div className="col-md-12">
                    <ReportingDateNavBarContainer taskStatus={taskStatus} releaseID={selectedRelease._id}/>
                </div>
                <div className="col-md-12">

                    <div className="col-md-8 releaseOption releaseDetailSearchContent">

                        <div className="col-md-6 ">
                            <div className="releaseDetailSearchFlag">
                                <select
                                    value={selectedRelease._id}
                                    className="form-control"
                                    title="Select Flag"
                                    onChange={(project) => this.onReleaseSelect(project.target.value)}>

                                    <option key={-1} value={''}>{'Select Project'}</option>
                                    {
                                        releases && releases.length ? releases.map((release, idx) =>
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
                            <div className="releaseDetailSearchStatus">
                                <select
                                    className="form-control"
                                    title="Select Status"
                                    value={taskStatus}
                                    onChange={(status) => this.onTaskStatusChange(status.target.value)}>
                                    <option key={0} value="all">All Task Status</option>
                                    <option key={1} value={SC.STATUS_UNPLANNED}>{SC.STATUS_UNPLANNED}</option>
                                    <option key={2} value={SC.STATUS_PENDING}>{SC.STATUS_PENDING}</option>
                                    <option key={3}
                                            value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                                    <option key={4} value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                                    <option key={5} value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
                                    <option key={6} value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                                    <option key={7} value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="estimation">
                        <BootstrapTable options={this.options} data={tasks}
                                        multiColumnSearch={true}
                                        search={true}
                                        striped={true}
                                        hover={true}
                                        cellEdit={cellEditProp}>

                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn editable={false} width="10%" columnTitle={'View Detail'} dataField='detailButton'
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
                            >Worked
                                Hours</TableHeaderColumn>
                            <TableHeaderColumn width="15%" columnTitle dataField="status"
                                               editable={{
                                                   type: 'select',
                                                   options: {
                                                       values: [SC.REPORT_PENDING, SC.REPORT_COMPLETED]
                                                   }
                                               }} dataFormat={this.formatReportedStatus}>Reported
                                Status</TableHeaderColumn>
                            <TableHeaderColumn width="12%" columnTitle dataField="reason"
                                               editable={{
                                                   type: 'select',
                                                   options: {
                                                       values: [SC.REASON_GENERAL_DELAY, SC.REASON_EMPLOYEE_ON_LEAVE, SC.REASON_INCOMPLETE_DEPENDENCY, SC.REASON_NO_GUIDANCE_PROVIDED, SC.REASON_RESEARCH_WORK, SC.REASON_UNFAMILIAR_TECHNOLOGY]
                                                   }
                                               }}>Reason
                                Code</TableHeaderColumn>

                            <TableHeaderColumn editable={false} width="5%" columnTitle={'Edit Report'} dataField="Edit Report"
                                               dataFormat={this.viewEditButton.bind(this)}>Edit
                            </TableHeaderColumn>
                            <TableHeaderColumn editable={false} width="7%" columnTitle={'Submit Report'} dataField="Submit Report"
                                               dataFormat={this.viewSubmitButton.bind(this)}>Submit
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(ReportingTaskPage)
