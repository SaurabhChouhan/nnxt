import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReportingDateNavbar} from '../index'
import {withRouter} from 'react-router-dom'


class ReportingTaskPage extends Component {

    constructor(props) {
        super(props);
        /* this.options = {
             onRowClick: this.onRowClick.bind(this)
         }*/
        this.state = {
            taskStatus: "all"
        }
        this.onTaskStatusChange = this.onTaskStatusChange.bind(this)
    }

    /*  onRowClick(row) {
          this.props.history.push("/app-home/reporting-tasks")
          this.props.projectSelected(row)

      }*/

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
        return (<select className="form-control" title="Select Status"
                        onChange={(status) => this.onFormatWorkedHoursChange(status.target.value)}>
            <option value="">Select Worked Hours</option>
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
        return (<select className="form-control" title="Select Status"
                        onChange={(status) => console.log("formatReasonCode", (status.target.value))}>
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

    viewEditButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom" type="button" onClick={() => {
                console.log("submit")

            }}>
                <i class="fa fa-pencil"></i>
            </button>

        )
    }

    viewSubmitButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom " type="button" onClick={() => {
                console.log("submit")
            }}>
                <i class="fa fa-check"></i>
            </button>
        )

    }

    onTaskStatusChange(status) {
        this.setState({taskStatus: status})
        this.props.changeReleaseStatus(this.state.releaseID, this.props.planDate, this.state.flag,status)
    }
    render() {
        const {selectedProject, allTaskPlans, allProjects} = this.props
        console.log("reporting", selectedProject)
        console.log("selectedProject", selectedProject)
        return (
            <div key="estimation_list" className="clearfix">
                <div className="col-md-12 releaseHeader">
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
                <div className="col-md-12">
                    <ReportingDateNavbar/>
                </div>
                <div className="col-md-12">

                    <div className="col-md-8 releaseOption releaseDetailSearchContent">

                        <div className="col-md-4 ">
                            <div className="releaseDetailSearchFlag">
                                <select
                                    className="form-control"
                                    title="Select Flag"
                                    onChange={(project) => this.props.onProjectSelect(project.target.value, planDate, taskStatus)}>

                                    <option value="">Select Project</option>
                                    {
                                        allProjects && allProjects.length ? allProjects.map(project => {
                                            return <option value={project._id}>{project.project.name}</option>
                                        }) : null
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="releaseDetailSearchStatus">
                                <select className="form-control" title="Select Status"
                                        onChange={(status) => this.onTaskStatusChange(status.target.value)}>
                                    <option value="all">All Task Status</option>
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
                        <BootstrapTable options={this.options} data={allTaskPlans}
                                        multiColumnSearch={true}
                                        search={true}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn width="20%" columnTitle dataField="task"
                                               dataFormat={this.formatTaskName.bind(this)}
                                               dataSort={true}>
                                Task Name</TableHeaderColumn>
                            <TableHeaderColumn width="12%" dataField="planning"
                                               dataFormat={this.formatPlannedHours.bind(this)}>
                                planned hours</TableHeaderColumn>
                            <TableHeaderColumn width="14%" columnTitle dataField="employee"
                                               dataFormat={this.formatWorkedHours.bind(this)}>Worked
                                Hours</TableHeaderColumn>
                            <TableHeaderColumn width="15%" columnTitle dataField="status"
                                               dataFormat={this.formatReportedStatus.bind(this)}>Reported
                                Status</TableHeaderColumn>
                            <TableHeaderColumn width="12%" dataField="additional"
                                               dataFormat={this.formatReasonCode.bind(this)}>Reason
                                Code</TableHeaderColumn>

                            <TableHeaderColumn width="15%" dataField='editButton'
                                               dataFormat={this.viewEditButton.bind(this)}>Edit
                            </TableHeaderColumn>
                            <TableHeaderColumn width="15%" dataField='deleteButton'
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
