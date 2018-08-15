import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReportingDateNavBarContainer} from '../../containers'
import {withRouter} from 'react-router-dom'
import {NotificationManager} from 'react-notifications'
import {ReportTaskDescriptionFormDialog} from "..";
import * as COC from "../componentConsts";
import * as A from "../../actions";


class ReportingTaskPage extends Component {

    constructor(props) {
        super(props)
        this.onReportedStatusChange = this.onReportedStatusChange.bind(this)
        this.onReleaseSelect = this.onReleaseSelect.bind(this)
        this.state = {
            showDescriptionDialog: false
        }
    }

    rowClassNameFormat(row, rowIdx) {
        console.log("rowClassNameFormat called " + row.rowDataChanged)
        return row.rowDataChanged ? 'td-row-changed' : row.report.status === SC.STATUS_COMPLETED ? 'td-row-completed' : row.report.status === SC.STATUS_PENDING ? 'td-row-pending' : 'td-row-unreported';
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

    formatReportStatus(report) {

        if (report && report.status)
            return report.status
        return SC.STATUS_UNREPORTED
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

    viewCompleteButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                if (row.reportedHours == null) {
                    NotificationManager.error('Please select worked hours!')
                } else {
                    row.rowDataChanged = false
                    row.status = SC.STATUS_COMPLETED
                    this.props.reportTask(row, this.props.dateOfReport, this.props.iterationType)/*.then(json => {
                        console.log("reportTask response is ", json)
                        if (!json.success) {
                            console.log("json.success is false ")
                            console.log("row is ", row)
                            row.rowDataChanged = true
                            this.forceUpdate()

                    })*/
                }
            }}>
                <i className="fa fa-check"></i>
            </button>
        )
    }

    viewPendingButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                if (row.reportedHours == null) {
                    NotificationManager.error('Please select worked hours!')
                } else {
                    row.rowDataChanged = false

                    row.status = SC.STATUS_PENDING
                    this.props.reportTask(row, this.props.dateOfReport, this.props.iterationType)/*.then(json => {
                        console.log("reportTask response is ", json)
                        if (!json.success) {
                            console.log("json.success is false ")
                            console.log("row is ", row)
                            row.rowDataChanged = true
                            this.forceUpdate()
                        }
                    })*/
                }
            }}>
                <i className="fa fa-close"></i>
            </button>
        )
    }

    viewSubmitButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                if (row.status == 'un-reported') {
                    NotificationManager.error('Please select status!')
                } else if (row.reportedHours == null) {
                    NotificationManager.error('Please select worked hours!')
                } else {
                    row.rowDataChanged = false
                    this.props.reportTask(row, this.props.dateOfReport, this.props.iterationType)
                        /*
                        .then(json => {
                        console.log("reportTask response is ", json)
                        if (!json.success) {
                            console.log("json.success is false ")
                            console.log("row is ", row)
                            row.rowDataChanged = true
                            this.forceUpdate()
                        }
                    })*/
                }
            }}>
                <i className="fa fa-check"></i>
            </button>
        )
    }

    viewDetailButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.props.taskPlanSelected(row).then(json => {
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
        this.props.setReportedStatus(this.props.releaseID, this.props.dateOfReport, this.props.iterationType, status)
    }

    onReleaseSelect(releaseID) {
        this.props.setReleaseID(releaseID, this.props.dateOfReport, this.props.iterationType, this.props.reportedStatus)
    }

    onIterationTypeChange(type) {
        this.props.setIterationType(this.props.releaseID, this.props.dateOfReport, type, this.props.reportedStatus)
    }

    onBeforeSaveCell(row, cellName, cellValue) {
        console.log("onBeforeSaveCell called ", cellName, cellValue)
    }

    onAfterSaveCell(row, cellName, cellValue) {
        console.log("onAfterSaveCell called ", cellName, cellValue, row.rowDataChanged)
        row.rowDataChanged = true
    }


    render() {

        const {allReleases, releases, reportedStatus, releaseID, iterationType} = this.props
        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            beforeSaveCell: this.onBeforeSaveCell,
            afterSaveCell: this.onAfterSaveCell
        }
        console.log("releases", releases)
        return (
            <div key="estimation_list" className="clearfix">

                <div className="col-md-12">
                    <ReportingDateNavBarContainer reportedStatus={reportedStatus} releaseID={releases}/>
                </div>
                <div className="col-md-12">
                    <div className="col-md-12 releaseOption releaseDetailSearchContent">
                        <div className="col-md-4 ">
                            <div>
                                <select
                                    className="form-control"
                                    title="Select Type"
                                    value={iterationType}
                                    onChange={(type) => this.onIterationTypeChange(type.target.value)}>
                                    <option key={SC.ITERATION_TYPE_PLANNED}
                                            value={SC.ITERATION_TYPE_PLANNED}>{SC.ITERATION_TYPE_PLANNED}</option>
                                    <option key={SC.ITERATION_TYPE_UNPLANNED}
                                            value={SC.ITERATION_TYPE_UNPLANNED}>{SC.ITERATION_TYPE_UNPLANNED}</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4 ">
                            <div>
                                <select
                                    value={releaseID}
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
                        <div className="col-md-4">
                            <div>
                                <select
                                    className="form-control"
                                    title="Select Status"
                                    value={reportedStatus}
                                    onChange={(status) => this.onReportedStatusChange(status.target.value)}>
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

                </div>
                <div className="estimation reporting">
                    {
                        iterationType == SC.ITERATION_TYPE_PLANNED && releases && releases.length ? releases.map((release, idx) =>
                            <div key={release._id}>
                                <BootstrapTable options={this.options}
                                                data={release && release.tasks && release.tasks.length > 0 ? release.tasks : []}
                                                striped={true}
                                                hover={true}
                                                trClassName={this.rowClassNameFormat.bind(this)}
                                                cellEdit={cellEditProp}>

                                    <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                                    </TableHeaderColumn>
                                    <TableHeaderColumn row='0' colSpan='6'>{release.releaseName}</TableHeaderColumn>

                                    <TableHeaderColumn row='1' editable={false} width="10%" columnTitle={'View Detail'}
                                                       dataField='detailButton'
                                                       dataFormat={this.viewDetailButton.bind(this)}>View Detail
                                    </TableHeaderColumn>
                                    <TableHeaderColumn row='1' editable={false} width="20%" columnTitle dataField="task"
                                                       dataFormat={this.formatTask}
                                                       dataSort={true}>
                                        Task Name</TableHeaderColumn>
                                    <TableHeaderColumn row='1' width="12%" columnTitle dataField="planning"
                                                       dataFormat={this.formatPlannedHours} editable={false}
                                    > planned hours</TableHeaderColumn>
                                    <TableHeaderColumn row='1' width="15%" columnTitle dataField="reportedHours"
                                                       dataFormat={this.formatReportedHours}
                                                       editable={{
                                                           type: 'select',
                                                           options: {
                                                               values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                                                           }
                                                       }}
                                    >Worked Hours</TableHeaderColumn>
                                    <TableHeaderColumn row='1' editable={false} width="7%"
                                                       columnTitle={'Reported Status'}
                                                       dataField="report"
                                                       dataFormat={this.formatReportStatus.bind(this)}>Status
                                    </TableHeaderColumn>
                                    <TableHeaderColumn row='1' editable={false} width="7%"
                                                       columnTitle={'Mark as Complete'}
                                                       dataField="Complete"
                                                       dataFormat={this.viewCompleteButton.bind(this)}>Complete
                                    </TableHeaderColumn>
                                    <TableHeaderColumn row='1' editable={false} width="7%"
                                                       columnTitle={'Mark as Pending'}
                                                       dataField="Pending"
                                                       dataFormat={this.viewPendingButton.bind(this)}>Pending
                                    </TableHeaderColumn>
                                </BootstrapTable>

                            </div>
                        ) : iterationType == SC.ITERATION_TYPE_UNPLANNED && releases && releases.length ? releases.map((release, idx) =>
                            <div key={release._id}>
                                <BootstrapTable options={this.options}
                                                data={release && release.tasks && release.tasks.length > 0 ? release.tasks : []}
                                                striped={true}
                                                hover={true}
                                                trClassName={this.rowClassNameFormat.bind(this)}
                                                cellEdit={cellEditProp}>

                                    <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                                    </TableHeaderColumn>
                                    <TableHeaderColumn row='0' colSpan='7'>{release.releaseName}</TableHeaderColumn>

                                    <TableHeaderColumn row='1' editable={false} width="20%" columnTitle={'View Detail'}
                                                       dataField='detailButton'
                                                       dataFormat={this.viewDetailButton.bind(this)}>View Detail
                                    </TableHeaderColumn>
                                    <TableHeaderColumn row='1' editable={false} width="40%" columnTitle dataField="task"
                                                       dataFormat={this.formatTask}
                                                       dataSort={true}>
                                        Task Name</TableHeaderColumn>
                                    <TableHeaderColumn row='1' width="20%" columnTitle dataField="reportedHours"
                                                       dataFormat={this.formatReportedHours}
                                                       editable={{
                                                           type: 'select',
                                                           options: {
                                                               values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                                                           }
                                                       }}
                                    >Worked Hours</TableHeaderColumn>
                                    <TableHeaderColumn row='1' editable={false} width="10%"
                                                       columnTitle={'Submit Report'}
                                                       dataField="Submit Report"
                                                       dataFormat={this.viewSubmitButton.bind(this)}>Submit
                                    </TableHeaderColumn>
                                </BootstrapTable>

                            </div>
                        ) : <label> No tasks found for reporting </label>
                    }
                </div>
            </div>

        )
    }
}

export default withRouter(ReportingTaskPage)