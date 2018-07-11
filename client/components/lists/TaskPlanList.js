import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReleaseTaskSearchFormContainer} from '../../containers'

class TaskPlanList extends Component {

    constructor(props) {
        super(props);
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


    render() {
        const {taskPlans} = this.props
        console.log("taskPlans------------------", taskPlans)
        return (
            <div className="estimation">
            <BootstrapTable options={this.options} data={taskPlans}
                            multiColumnSearch={true}
                            search={true}
                            striped={true}
                            hover={true}>
                <TableHeaderColumn columnTitle isKey dataField='_id'
                                   hidden={true}>ID
                </TableHeaderColumn>
                <TableHeaderColumn columnTitle dataField='employee'
                                   dataFormat={this.formatDeveloperName.bind(this)}>Developer
                </TableHeaderColumn>
                <TableHeaderColumn columnTitle dataField='task'
                                   dataFormat={this.formatTaskName.bind(this)}>Tasks
                </TableHeaderColumn>
                <TableHeaderColumn columnTitle dataField='planningDate' dataFormat={this.formatPlannedDate.bind(this)}>Planning
                    Date
                </TableHeaderColumn>
                <TableHeaderColumn columnTitle dataField='planning' dataFormat={this.formatPlannedHours.bind(this)}>Planned
                    Hours
                </TableHeaderColumn>

            </BootstrapTable>
            </div>
        )
    }
}

export default withRouter(TaskPlanList)
