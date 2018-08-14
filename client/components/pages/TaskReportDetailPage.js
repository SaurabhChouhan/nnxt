import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import momentTZ from 'moment-timezone'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import {withRouter} from 'react-router-dom'
import {ReportingCommentFormContainer} from "../../containers";
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class TaskReportDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.commentListPageOptions = {
            sizePerPageList: [{
                text: '4', value: 4
            }],
            sizePerPage: 4,  // which size per page you want to locate as default
        }

        this.taskListPageOptions = {
            sizePerPageList: [{
                text: '4', value: 4
            }],
            sizePerPage: 4,  // which size per page you want to locate as default
        }
    }

    formatDeveloperName(employee) {
        if (employee)
            return employee.name
        return ''
    }

    formatPlanDate(date) {
        console.log('date found as ', date)
        return momentTZ(date).utc().format('DD MMM,YY')
    }

    formatReportStatus(report) {

        if (report && report.status)
            return report.status
        return ''
    }

    formatTaskDescription(task) {

        if (task)
            return task.description
        return ''
    }

    render() {
        const {selectedTaskPlan, selectedRelease, selectedReleasePlan, taskPlans, ReleasePlan, developerPlans} = this.props

        return (

            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => {
                                this.props.history.push("/app-home/release-plan")
                                this.props.ReportGoBack()
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>

                <TimelineEvent title={'Comments :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <ReportingCommentFormContainer/>
                    {
                        <div className="ReportingCommentTable">

                            <BootstrapTable data={selectedReleasePlan.comments}
                                            striped={true}
                                            hover={true}
                                            options={this.commentListPageOptions}
                                            pagination
                                            height={"302px"}>
                                <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                                </TableHeaderColumn>
                                <TableHeaderColumn width="12%" columnTitle dataField="dateInIndia">
                                    Date/Time
                                </TableHeaderColumn>
                                <TableHeaderColumn width="38%" columnTitle dataField='comment'
                                >Comment
                                </TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="commentType"
                                                   dataSort={true}>
                                    Comment Type</TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="name">
                                    Commented By</TableHeaderColumn>

                            </BootstrapTable>
                        </div>

                    }

                </TimelineEvent>

                <TimelineEvent title={'Task Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTaskPlan && selectedTaskPlan.task && selectedTaskPlan.task.name ? selectedTaskPlan.task.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Developer Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTaskPlan && selectedTaskPlan.employee && selectedTaskPlan.employee.name ? selectedTaskPlan.employee.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Task Planning (Developer):'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <div className="DeveloperTasksTable">
                        <BootstrapTable
                            data={taskPlans}
                            striped={true}
                            hover={true}
                            options={this.taskListPageOptions}
                            pagination
                            height={"202px"}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"15%"} columnTitle dataField='planningDate'
                                               dataFormat={this.formatPlanDate.bind(this)}>Planned Date
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"75%"} columnTitle dataField='description'>Tasks
                                Description
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"15%"} columnTitle dataField='report'
                                               dataFormat={this.formatReportStatus.bind(this)}>Reported Status
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </TimelineEvent>

                <TimelineEvent title={'Task Description :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description"> {selectedReleasePlan && selectedReleasePlan.task && selectedReleasePlan.task.description ? selectedReleasePlan.task.description : ''}</p>
                </TimelineEvent>


                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Project Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {selectedRelease && selectedRelease.project && selectedRelease.project.name ? selectedRelease.project.name : ''}
                </TimelineEvent>


                < TimelineEvent style={{fontSize: '20px'}}
                                title={'Project Description :'}
                                icon={<i
                                    className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    <p className="description">{selectedReleasePlan && selectedReleasePlan.estimationDescription ? selectedReleasePlan.estimationDescription : ''}</p>
                </TimelineEvent>

            </Timeline>


        )
    }
}

export default withRouter(TaskReportDetailPage);
