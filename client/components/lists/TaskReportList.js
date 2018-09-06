import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {TaskReportDateNavBarContainer} from '../../containers'

class TaskReportList extends Component {

    constructor(props) {
        super(props);
        let sizePerPage = Math.floor((props.screenHeight - 320)/25)
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
            sizePerPage,  // which size per page you want to locate as default
            onRowClick: this.onRowClick.bind(this)

        }
    }

    componentDidMount() {
        //this.props.getAllTaskReports(this.props.release)
    }

    formatPlanningDate(dateString) {
        if (dateString) {
            return moment(dateString, SC.DATE_FORMAT).format(SC.DATE_DISPLAY_FORMAT)
            //return row
        }
        return ''
    }

    formatReportedOnDate(report){
        if(report && report.reportedOnDate){
            return moment(report.reportedOnDate).format(SC.DATE_TIME_FORMAT)
        }
        return ''
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
            return moment(row).format("DD-MM-YYYY")
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

    formatTaskDescription(report) {
        console.log("get the task Description",report.description)
        if (report)
            return report.description
        return ''
    }
    onRowClick(row) {
        this.props.taskPlanSelected(row).then(json => {
            if (json.success) {
                this.props.history.push('/app-home/task-report-detail')
                this.props.showTaskDetailPage()
            }
            return json
        })
    }

    viewDetailButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.props.taskPlanSelected(row).then(json => {
                    if (json.success) {
                        this.props.history.push('/app-home/task-report-detail')
                        this.props.showTaskDetailPage()
                    }
                    return json
                })
            }}>
                <i className="fa fa-eye"></i>
            </button>
        )
    }

    render() {
        const {reports, screenHeight} = this.props
        let tableHeight = screenHeight - 335

        console.log("reports------------------", reports)
        console.log("expandDescription------------------", this.props.expandDescription)
        return (
            <div>
                <div>
                    <TaskReportDateNavBarContainer/>
                </div>
                {this.props.expandDescription ?
                    <div className="col-md-12 wrapTextTable">
                        <BootstrapTable options={this.options} data={reports}
                                        multiColumnSearch={true}
                                        search={false}
                                        striped={true}
                                        pagination
                                        hover={true}
                                        height={tableHeight+"px"}>
                            <TableHeaderColumn columnTitle isKey dataField='_id'
                                               hidden={true}>ID
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"15%"} dataField='task'
                                               dataFormat={this.formatTaskName.bind(this)}>Task Name
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"33%"} columnTitle dataField='report'
                                               dataFormat={this.formatTaskDescription.bind(this)}>Task Description
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"14%"} columnTitle dataField='employee'
                                               dataFormat={this.formatDeveloperName.bind(this)}>Developer
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"10%"} dataField='planningDateString'
                                               dataFormat={this.formatPlanningDate.bind(this)}>Planning
                                Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"12%"} dataField='report'
                                               dataFormat={this.formatReportedOnDate.bind(this)}>Reported On
                            </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='report'
                                               dataFormat={this.formatReportedHours.bind(this)} dataAlign={"right"}>Reported
                                </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='report'
                                               dataFormat={this.formatReportedStatus.bind(this)} dataAlign={"center"}>Status
                            </TableHeaderColumn>

                        </BootstrapTable>
                    </div> :
                    <div className="col-md-12 ">
                        <BootstrapTable options={this.options} data={reports}
                                        multiColumnSearch={true}
                                        search={false}
                                        striped={true}
                                        pagination
                                        hover={true}
                                        height={tableHeight+"px"}>
                            <TableHeaderColumn columnTitle isKey dataField='_id'
                                               hidden={true}>ID
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"15%"} dataField='task'
                                               dataFormat={this.formatTaskName.bind(this)}>Task Name
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"25%"} columnTitle dataField='report'
                                               dataFormat={this.formatTaskDescription.bind(this)}>Task Description
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"14%"} columnTitle dataField='employee'
                                               dataFormat={this.formatDeveloperName.bind(this)}>Developer
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"10%"} dataField='planningDateString'
                                               dataFormat={this.formatPlanningDate.bind(this)}>Planned On
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"12%"} dataField='report'
                                               dataFormat={this.formatReportedOnDate.bind(this)}>Reported On
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle width={"8%"} dataField='planning'
                                               dataFormat={this.formatPlannedHours.bind(this)} dataAlign={"right"}>Planned

                            </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='report'
                                               dataFormat={this.formatReportedHours.bind(this)} dataAlign={"right"}>Reported
                                </TableHeaderColumn>
                            <TableHeaderColumn width="8%" columnTitle dataField='report'
                                               dataFormat={this.formatReportedStatus.bind(this)} dataAlign={"center"}>Status
                            </TableHeaderColumn>

                        </BootstrapTable>
                    </div>}
            </div>
        )
    }
}

export default withRouter(TaskReportList)
