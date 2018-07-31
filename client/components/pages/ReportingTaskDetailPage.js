import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import {withRouter} from 'react-router-dom'
import {ReportingCommentFormContainer} from '../../containers'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

class ReportingTaskDetailPage extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {taskPlan, release, releasePlan} = this.props


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


                <TimelineEvent title={'Task Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {taskPlan && taskPlan.task && taskPlan.task.name ? taskPlan.task.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Task Description :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description">  {releasePlan && releasePlan.task && releasePlan.task.description ? releasePlan.task.description : ''}</p>
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
                            <p className="description"> {taskPlan && taskPlan.description ? taskPlan.description : ''}</p>
                        </TimelineEvent>


                        <TimelineEvent title={' Reported Status :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {taskPlan && taskPlan.report && taskPlan.report.status ? taskPlan.report.status : ''}
                        </TimelineEvent>


                    </Timeline>
                </TimelineEvent>

                <TimelineEvent title={'Comments :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {
                        <div className="ReportingCommentTable">

                            <BootstrapTable
                                data={releasePlan.comments && releasePlan.comments.length ? releasePlan.comments : []}
                                multiColumnSearch={true}
                                search={true}
                                striped={true}
                                hover={true}>
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
                    <ReportingCommentFormContainer/>
                </TimelineEvent>


            </Timeline>


        )
    }
}

export default withRouter(ReportingTaskDetailPage)

