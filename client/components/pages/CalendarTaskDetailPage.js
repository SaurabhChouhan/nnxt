import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import {withRouter} from 'react-router-dom'

class CalendarTaskDetailPage extends React.Component {
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
                                this.props.history.push("/app-home/calendar")
                                this.props.calenderGoBack()
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

                {selectedTask && selectedTask.task && selectedTask.task.name ?
                    <TimelineEvent title={"Task Name :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                   style={{fontSize: '20px'}}>
                        {selectedTask.task.name}
                    </TimelineEvent> : null
                }

                {selectedReleasePlan && selectedReleasePlan.task && selectedReleasePlan.task.description ?
                    <TimelineEvent title={"Task Description :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                   style={{fontSize: '20px'}}>
                        {selectedReleasePlan.task.description}
                    </TimelineEvent> : null

                }

                <TimelineEvent title={"Assigned To You :"}
                               icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <Timeline>

                        {selectedTask && selectedTask.planningDate ?
                            < TimelineEvent title={" Planned Date :"}
                                            icon={<i
                                                className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                            style={{fontSize: '20px'}}>
                                {moment(selectedTask.planningDate).format(SC.DATE_AND_TIME_FORMAT)}
                            </TimelineEvent> : null
                        }
                        {selectedTask && selectedTask.planning && selectedTask.planning.plannedHours ?
                            <TimelineEvent title={" Planned Hours :"}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                           style={{fontSize: '20px'}}>
                                {selectedTask.planning.plannedHours}
                            </TimelineEvent> : null

                        }

                        {selectedTask && selectedTask.description ?
                            <TimelineEvent title={"Details :"}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                           style={{fontSize: '20px'}}>
                                {selectedTask.description}
                            </TimelineEvent> : null
                        }

                        {selectedTask && selectedTask.report && selectedTask.report.status ?
                            <TimelineEvent title={" Reported Status :"}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                           style={{fontSize: '20px'}}>
                                {selectedTask.report.status}
                            </TimelineEvent> : null

                        }


                    </Timeline>
                </TimelineEvent>

                <TimelineEvent title={"Comments :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {
                        <div className="ReportingCommentTable">

                            <BootstrapTable
                                data={selectedReleasePlan && selectedReleasePlan.comments && Array.isArray(selectedReleasePlan.comments) ? selectedReleasePlan.comments : []}
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
                </TimelineEvent>

            </Timeline>



        )
    }
}

export default withRouter(CalendarTaskDetailPage);
