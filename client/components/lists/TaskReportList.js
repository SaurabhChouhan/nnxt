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
                text: '7', value: 7
            }, {
                text: '10', value: 10
            }, {
                text: '20', value: 20
            }, {
                text: '50', value: 50
            }],
            sizePerPage: 7,  // which size per page you want to locate as default
            paginationShowsTotal:true
        }
    }

    formatDeveloperName(employee) {
        if (employee)
            return employee.name
        return ''
    }

    formatTaskName(task) {
        if (task)
            return task.name
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
            <div className="estimation releasePlan-taskPlan release-plan-table">
                <BootstrapTable options={this.options} data={reports}
                                multiColumnSearch={true}
                                search={true}
                                striped={true}
                                pagination
                                hover={true}>
                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                       hidden={true}>ID
                    </TableHeaderColumn>

                    <TableHeaderColumn editable={false} columnTitle={'View Detail'}
                                       dataField='detailButton'
                                       dataFormat={this.viewDetailButton.bind(this)}>View Detail
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle dataField='employee'
                                       dataFormat={this.formatDeveloperName.bind(this)}>Developer
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle dataField='task'
                                       dataFormat={this.formatTaskName.bind(this)}>Task Name
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle dataField='planningDateString'>Planning
                        Date
                    </TableHeaderColumn>
                    <TableHeaderColumn columnTitle dataField='planning' dataFormat={this.formatPlannedHours.bind(this)}>Planned
                        Hours
                    </TableHeaderColumn>
                    <TableHeaderColumn width=" 11%" columnTitle dataField='report'
                                       dataFormat={this.formatReportedHours.bind(this)}>Reported
                        Hours</TableHeaderColumn>
                    <TableHeaderColumn width="15%" columnTitle dataField='report'
                                       dataFormat={this.formatReportedStatus.bind(this)}>Status
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>
        )
    }
}

export default withRouter(TaskReportList)
