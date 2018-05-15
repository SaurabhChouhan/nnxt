import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import {withRouter} from 'react-router-dom'
import {ReportingCommentFormContainer} from '../../containers'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

class ReportingTaskDetailPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {selectedTask, selectedProject, selectedReleasePlan} = this.props
        return (
            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => {
                                this.props.history.push("/app-home/reporting")
                                this.props.ReportingGoBack()
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>
                {selectedProject && selectedProject.project && selectedProject.project.name ?
                    <TimelineEvent style={{fontSize: '20px'}}
                                   title={"Project Name :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                        {selectedProject.project.name}
                    </TimelineEvent>
                    : null
                }

                {selectedProject && selectedProject.estimationDescription &&
                < TimelineEvent style={{fontSize: '20px'}}
                                title={"Project Description :"}
                                icon={<i
                                    className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    {selectedProject.estimationDescription}
                </TimelineEvent>}

                {selectedTask && selectedTask.task && selectedTask.task.name &&
                <TimelineEvent title={"Task Name :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTask.task.name}
                </TimelineEvent>
                }

                {selectedReleasePlan && selectedReleasePlan.task && selectedReleasePlan.task.description &&
                <TimelineEvent title={"Task Description :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedReleasePlan.task.description}
                </TimelineEvent>

                }

                <TimelineEvent title={"Assigned To You :"}
                               icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <Timeline>

                        {selectedTask && selectedTask.planningDate &&
                        < TimelineEvent title={" Planned Date :"}
                                        icon={<i
                                            className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                        style={{fontSize: '20px'}}>
                            {moment(selectedTask.planningDate).format(SC.DATE_AND_TIME_FORMAT)}
                        </TimelineEvent>
                        }
                        {selectedTask && selectedTask.planning && selectedTask.planning.plannedHours &&
                        <TimelineEvent title={" Planned Hours :"}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {selectedTask.planning.plannedHours}
                        </TimelineEvent>

                        }

                        {selectedTask && selectedTask.description &&
                        <TimelineEvent title={"Details :"}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {selectedTask.description}
                        </TimelineEvent>
                        }

                        {selectedTask && selectedTask.report && selectedTask.report.status &&
                        <TimelineEvent title={" Reported Status :"}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {selectedTask.report.status}
                        </TimelineEvent>

                        }


                    </Timeline>
                </TimelineEvent>

                <TimelineEvent title={"Comments :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {
                        <div className="ReportingCommentTable">

                            <BootstrapTable data={selectedReleasePlan.comments}
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
                                <TableHeaderColumn width="10%" columnTitle dataField="date">
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

