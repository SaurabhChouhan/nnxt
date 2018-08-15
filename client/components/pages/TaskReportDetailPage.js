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

    assignedTasksRowClass(row) {
        return row._id.toString() == this.props.taskPlan._id.toString() ? 'td-row-completed' : 'td-row-unreported'
    }

    render() {
        const {taskPlan, release, releasePlan, taskPlans} = this.props

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

                <TimelineEvent title={'Task Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {taskPlan && taskPlan.task && taskPlan.task.name ? taskPlan.task.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Developer Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {taskPlan && taskPlan.employee && taskPlan.employee.name ? taskPlan.employee.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Task Planning (' + taskPlan.employee.name + ')'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <div className="DeveloperTasksTable">
                        <BootstrapTable
                            data={taskPlans}
                            striped={true}
                            hover={true}
                            options={this.taskListPageOptions}
                            trClassName={this.assignedTasksRowClass.bind(this)}
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


                <TimelineEvent title={'Comments :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <ReportingCommentFormContainer/>
                    {
                        <div className="ReportingCommentTable">

                            <BootstrapTable data={releasePlan.comments}
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

                <TimelineEvent title={'Task Day Report Details :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description">  {taskPlan && taskPlan.report && taskPlan.report.description ? taskPlan.report.description : ''}</p>
                </TimelineEvent>


                <TimelineEvent title={'Task Day Requirement :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description">  {taskPlan && taskPlan.description ? taskPlan.description : ''}</p>
                </TimelineEvent>


                <TimelineEvent title={'Task Description :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description"> {releasePlan && releasePlan.task && releasePlan.task.description ? releasePlan.task.description : ''}</p>
                </TimelineEvent>


                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Project Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {release && release.project && release.project.name ? release.project.name : ''}
                </TimelineEvent>


                < TimelineEvent style={{fontSize: '20px'}}
                                title={'Project Description :'}
                                icon={<i
                                    className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    <p className="description">{releasePlan && releasePlan.estimationDescription ? releasePlan.estimationDescription : ''}</p>
                </TimelineEvent>

            </Timeline>


        )
    }
}

export default withRouter(TaskReportDetailPage);
