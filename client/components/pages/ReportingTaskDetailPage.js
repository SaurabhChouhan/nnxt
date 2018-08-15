import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import {withRouter} from 'react-router-dom'
import {ReportingCommentFormContainer} from '../../containers'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import momentTZ from "moment-timezone";

class ReportingTaskDetailPage extends React.Component {
    constructor(props) {
        super(props)
        this.commentListPageOptions = {
            sizePerPageList: [{
                text: '4', value: 4
            }],
            sizePerPage: 4,  // which size per page you want to locate as default
        }
    }

    assignedTasksRowClass(row) {
        return row._id.toString() == this.props.taskPlan._id.toString() ? 'td-row-completed' : 'td-row-unreported'
    }

    formatPlanDate(date) {
        console.log('date found as ', date)
        return momentTZ(date).utc().format('DD MMM,YY')
    }

    formatPlannedHours(planning) {
        if (planning && planning.plannedHours)
            return planning.plannedHours
        return ''
    }

    formatReportedHours(report) {
        if (report && report.reportedHours)
            return report.reportedHours
        return ''
    }

    formatReportStatus(report) {

        if (report && report.status)
            return report.status
        return SC.STATUS_UNREPORTED
    }

    render() {
        const {taskPlan, release, releasePlan, taskPlans} = this.props

        return (
            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => {
                                this.props.history.push('/app-home/reporting')
                                this.props.ReportingGoBack()
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>

                <TimelineEvent title={'Task Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {taskPlan && taskPlan.task && taskPlan.task.name ? taskPlan.task.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Work Assigned to You for this Task:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <div className="DeveloperTasksTable">
                        <BootstrapTable
                            data={taskPlans}
                            striped={true}
                            hover={true}
                            options={this.taskListPageOptions}
                            pagination
                            trClassName={this.assignedTasksRowClass.bind(this)}
                            height={"202px"}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"15%"} columnTitle dataField='planningDate'
                                               dataFormat={this.formatPlanDate.bind(this)}>Planned Date
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"45%"} columnTitle dataField='description'>Tasks
                                Description
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"15%"} columnTitle dataField='planning'
                                               dataFormat={this.formatPlannedHours.bind(this)}>Planned Hours
                            </TableHeaderColumn>
                            <TableHeaderColumn width={"15%"} columnTitle dataField='report'
                                               dataFormat={this.formatReportedHours.bind(this)}>Reported Hours
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
                            <BootstrapTable
                                data={releasePlan.comments && releasePlan.comments.length ? releasePlan.comments : []}
                                striped={true}
                                hover={true}
                                options={this.commentListPageOptions}
                                pagination
                                height={"300px"}>
                                <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                                </TableHeaderColumn>
                                <TableHeaderColumn width="12%" columnTitle dataField="dateInIndia">
                                    Date/Time
                                </TableHeaderColumn>

                                <TableHeaderColumn width="40%" columnTitle dataField='comment'
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

                <TimelineEvent title={'Task Requirement:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description">  {releasePlan && releasePlan.task && releasePlan.task.description ? releasePlan.task.description : ''}</p>
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

export default withRouter(ReportingTaskDetailPage)

