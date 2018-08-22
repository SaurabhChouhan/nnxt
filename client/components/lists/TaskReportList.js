import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'


class TaskReportList extends Component {

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
            onRowClick: this.onRowClick.bind(this)

        }
    }

    componentDidMount() {
        this.props.getAllTaskReports(this.props.release)
    }

    formatPlanningDate(dateString) {
        if (dateString) {
            return moment(dateString, SC.DATE_FORMAT).format(SC.DATE_DISPLAY_FORMAT)
            //return row
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
        const {reports} = this.props
        console.log("reports------------------", reports)
        return (
            <div className="col-md-12 release-options">
                <BootstrapTable options={this.options} data={reports}
                                multiColumnSearch={true}
                                search={false}
                                striped={true}
                                pagination
                                hover={true}
                                height={"300px"}>
                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                       hidden={true}>ID
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle width={"25%"} dataField='task'
                                       dataFormat={this.formatTaskName.bind(this)}>Task Name
                    </TableHeaderColumn>
                    <TableHeaderColumn width={"25%"} columnTitle dataField='employee'
                                       dataFormat={this.formatDeveloperName.bind(this)}>Developer
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle width={"14%"} dataField='planningDateString' dataFormat={this.formatPlanningDate.bind(this)}>Planning
                        Date
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle width={"12%"} dataField='planning' dataFormat={this.formatPlannedHours.bind(this)} dataAlign={"right"}>Planned
                        Hours
                    </TableHeaderColumn>
                    <TableHeaderColumn width="12%" columnTitle dataField='report'
                                       dataFormat={this.formatReportedHours.bind(this)} dataAlign={"right"}>Reported
                        Hours</TableHeaderColumn>
                    <TableHeaderColumn width="12%" columnTitle dataField='report'
                                       dataFormat={this.formatReportedStatus.bind(this)} dataAlign={"center"}>Status
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>
        )
    }
}

export default withRouter(TaskReportList)
