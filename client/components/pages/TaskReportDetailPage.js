import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
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

    formatTaskName(task) {

        if (task)
            return task.name
        return ''
    }

    formatTaskDescription(task) {

        if (task)
            return task.description
        return ''
    }

    render() {
        const {taskPlan, release, releasePlan, taskPlans} = this.props

        return (

            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => {
                                this.props.history.push("/app-home/release-plan")
                                this.props.ReportGoBack(release)
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>

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
                                <TableHeaderColumn width="40%" columnTitle dataField='comment'
                                >Comment
                                </TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="commentType"
                                                   dataSort={true}>
                                    Comment Type</TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="name">
                                    Commented By</TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="dateString">
                                    Date
                                </TableHeaderColumn>
                            </BootstrapTable>
                        </div>

                    }

                </TimelineEvent>

                <TimelineEvent title={'Task Info :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>

                    {
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
                                <TableHeaderColumn columnTitle dataField='employee'
                                                   dataFormat={this.formatDeveloperName.bind(this)}>Developer
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'
                                                   dataFormat={this.formatTaskName.bind(this)}>Tasks
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'
                                                   dataFormat={this.formatTaskDescription.bind(this)}>Tasks
                                    Description
                                </TableHeaderColumn>
                            </BootstrapTable>


                        </div>

                    }

                </TimelineEvent>


                <TimelineEvent title={'Task Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {taskPlan && taskPlan.task && taskPlan.task.name ? taskPlan.task.name : ''}
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


                <TimelineEvent title={'Assigned To You :'}
                               icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <Timeline>


                        < TimelineEvent title={' Planned Date :'}
                                        icon={<i
                                            className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                        style={{fontSize: '20px'}}>
                            {taskPlan && taskPlan.planningDate ? moment(taskPlan.planningDate).format(SC.DATE_AND_TIME_FORMAT) : ''}
                        </TimelineEvent>


                        <TimelineEvent title={' Planned Hours :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {taskPlan && taskPlan.planning && taskPlan.planning.plannedHours ? taskPlan.planning.plannedHours : ''}
                        </TimelineEvent>


                        <TimelineEvent title={'Details :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            <p className="description">    {taskPlan && taskPlan.description ? taskPlan.description : ''}</p>
                        </TimelineEvent>


                        <TimelineEvent title={' Reported Status :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {taskPlan && taskPlan.report && taskPlan.report.status ? taskPlan.report.status : ''}
                        </TimelineEvent>


                    </Timeline>
                </TimelineEvent>


            </Timeline>


        )
    }
}

export default withRouter(TaskReportDetailPage);
