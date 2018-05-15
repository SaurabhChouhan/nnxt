import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReportingDateNavBarContainer} from '../../containers'
import {withRouter} from 'react-router-dom'


class ReportingTaskPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            taskStatus: this.props.taskStatus,
            releaseID: this.props.releaseID
        }
        this.onTaskStatusChange = this.onTaskStatusChange.bind(this)
        this.onProjectSelect = this.onProjectSelect.bind(this)
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

    formatTaskName(task) {
        if (task)
            return task.name
        return ''
    }

    formatWorkedHours(report) {
        return (<select className="form-control" title="Select Worked Hours"
                        onChange={(status) => console.log("WorkedHours", (status.target.value))}>
            <option value="0">Select Worked Hours</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
        </select>)
    }

    formatPlannedHours(planning) {
        if (planning)
            return planning.plannedHours
        return 0
    }

    formatReportedStatus(report) {
        return (<select className="form-control" title="Select Status"
                        onChange={(status) => console.log("reported Status", (status.target.value))}>
            <option value="all">All Status</option>
            <option value={SC.STATUS_UNPLANNED}>{SC.STATUS_UNPLANNED}</option>
            <option value={SC.STATUS_PENDING}>{SC.STATUS_PENDING}</option>
            <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
            <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
            <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
            <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
            <option value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

        </select>)

    }

    formatReasonCode(report) {
        return (<select className="form-control" title="Select Reason Code"
                        onChange={(status) => console.log("ReasonCode", (status.target.value))}>
            <option value={undefined}>Select Reason</option>
            <option value={SC.STATUS_UNPLANNED}>{SC.STATUS_UNPLANNED}</option>
            <option value={SC.STATUS_PENDING}>{SC.STATUS_PENDING}</option>
            <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
            <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
            <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
            <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
            <option value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

        </select>)
    }

    viewEditButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom" type="button" onClick={() => {
                console.log("edit")
            }}>
                <i className="fa fa-pencil"></i>
            </button>
        )
    }

    viewSubmitButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                console.log("Submit")
            }}>
                <i className="fa fa-check"></i>
            </button>
        )
    }

    viewDetailButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.props.taskSelected(row, this.props.selectedProject).then(json => {
                    if (json.success) {
                        this.props.history.push("/app-home/reporting-task-detail")
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
        this.setState({taskStatus: status})
        this.props.onProjectSelect(this.state.releaseID, this.props.dateOfReport, status)
        this.props.setStatus(status)

    }

    onProjectSelect(releaseID) {
        this.setState({releaseID: releaseID})
        this.props.onProjectSelect(releaseID, this.props.dateOfReport, this.state.taskStatus)
        this.props.setProjectId(releaseID)
    }

    render() {

        const {selectedProject, allTaskPlans, allProjects} = this.props
        const {taskStatus, releaseID} = this.state

        return (
            <div key="estimation_list" className="clearfix">
                {
                    selectedProject && selectedProject._id && <div className="col-md-12 releaseHeader">
                        <div className="col-md-3">
                            <div className="releaseTitle">
                            <span
                                title={selectedProject.project ? selectedProject.project.name : ''}>Project Name</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedProject.project ? selectedProject.project.name : ''}</p>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="releaseTitle">
                            <span
                                title={selectedProject.initial ? moment(selectedProject.initial.devStartDate).format("DD-MM-YYYY") : ''}>Start Date</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedProject.initial ? moment(selectedProject.initial.devStartDate).format("DD-MM-YYYY") : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="releaseTitle">
                            <span
                                title={selectedProject.initial ? moment(selectedProject.initial.devEndDate).format("DD-MM-YYYY") : ''}>End Date</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedProject.initial ? moment(selectedProject.initial.devEndDate).format("DD-MM-YYYY") : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="releaseTitle">
                            <span
                                title={selectedProject.initial ? moment(selectedProject.initial.clientReleaseDate).format("DD-MM-YYYY") : ''}>Release Date</span>
                            </div>
                            <div className="releasecontent">
                                <p>{selectedProject.initial ? moment(selectedProject.initial.clientReleaseDate).format("DD-MM-YYYY") : ''}</p>
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
                    <ReportingDateNavBarContainer taskStatus={taskStatus} releaseID={releaseID}/>
                </div>
                <div className="col-md-12">

                    <div className="col-md-8 releaseOption releaseDetailSearchContent">

                        <div className="col-md-6 ">
                            <div className="releaseDetailSearchFlag">
                                <select
                                    value={releaseID}
                                    className="form-control"
                                    title="Select Flag"
                                    onChange={(project) => this.onProjectSelect(project.target.value)}>

                                    <option key={-1} value={''}>{"Select Project"}</option>
                                    {
                                        allProjects && allProjects.length ? allProjects.map((project, idx) =>
                                            <option
                                                key={idx}
                                                value={project._id}>
                                                {project.project.name}
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
                                       value = {taskStatus}
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
                        <BootstrapTable options={this.options} data={allTaskPlans}
                                        multiColumnSearch={true}
                                        search={true}
                                        striped={true}
                                        hover={true}>

                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn width="10%" columnTitle={"View Detail"} dataField='detailButton'
                                               dataFormat={this.viewDetailButton.bind(this)}>View Detail
                            </TableHeaderColumn>
                            <TableHeaderColumn width="20%" columnTitle dataField="task"
                                               dataFormat={this.formatTaskName.bind(this)}
                                               dataSort={true}>
                                Task Name</TableHeaderColumn>
                            <TableHeaderColumn width="12%" columnTitle dataField="planning"
                                               dataFormat={this.formatPlannedHours.bind(this)}>
                                planned hours</TableHeaderColumn>
                            <TableHeaderColumn width="15%" columnTitle dataField="employee"
                                               dataFormat={this.formatWorkedHours.bind(this)}>Worked
                                Hours</TableHeaderColumn>
                            <TableHeaderColumn width="15%" columnTitle dataField="status"
                                               dataFormat={this.formatReportedStatus.bind(this)}>Reported
                                Status</TableHeaderColumn>
                            <TableHeaderColumn width="12%" columnTitle dataField="additional"
                                               dataFormat={this.formatReasonCode.bind(this)}>Reason
                                Code</TableHeaderColumn>

                            <TableHeaderColumn width="5%" columnTitle={"Edit Report"} dataField="Edit Report"
                                               dataFormat={this.viewEditButton.bind(this)}>Edit
                            </TableHeaderColumn>
                            <TableHeaderColumn width="7%" columnTitle={"Submit Report"} dataField="Submit Report"
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
