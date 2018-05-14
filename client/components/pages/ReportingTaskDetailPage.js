import React from 'react'
import moment from 'moment'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import * as SC from '../../../server/serverconstants'
import {withRouter} from 'react-router-dom'
import {ReportingCommentFormContainer} from '../../containers'

class ReportingTaskDetailPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {selectedTask, selectedProject} = this.props
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
                {selectedProject && selectedProject.project.name ?
                    <TimelineEvent style={{fontSize: '20px'}}
                                   title={"Project Name :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                        {selectedProject.project.name}
                    </TimelineEvent>
                    : null
                }

                <TimelineEvent style={{fontSize: '20px'}}
                               title={"Project Description :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    {selectedProject.estimationDescription}
                </TimelineEvent>

                {selectedTask && selectedTask.task.name ?
                    <TimelineEvent title={"Task Name :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                   style={{fontSize: '20px'}}>
                        {selectedTask.task.name}
                    </TimelineEvent>
                    : null
                }

                {selectedProject && selectedProject.releasePlan.task.description ?
                    <TimelineEvent title={"Task Description :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                   style={{fontSize: '20px'}}>
                        {selectedProject.releasePlan.task.description}
                    </TimelineEvent>
                    : null
                }

                <TimelineEvent title={"Assigned To You :"}
                               icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <Timeline>

                        <TimelineEvent title={" Planned Date :"}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {moment(selectedTask.planningDate).format(SC.DATE_AND_TIME_FORMAT)}
                        </TimelineEvent>

                        {selectedTask && selectedTask.planning.plannedHours ?
                            <TimelineEvent title={" Planned Hours :"}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                           style={{fontSize: '20px'}}>
                                {selectedTask.planning.plannedHours}
                            </TimelineEvent>
                            : null
                        }

                        <TimelineEvent title={"Details :"}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {selectedTask.description}
                        </TimelineEvent>

                        {selectedTask && selectedTask.report.status ?
                            <TimelineEvent title={" Reported Status :"}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                           style={{fontSize: '20px'}}>
                                {selectedTask.report.status}
                            </TimelineEvent>
                            : null
                        }


                    </Timeline>
                </TimelineEvent>

                <TimelineEvent title={"Comment :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <ReportingCommentFormContainer/>
                </TimelineEvent>

            </Timeline>


        )
    }
}

export default withRouter(ReportingTaskDetailPage)
