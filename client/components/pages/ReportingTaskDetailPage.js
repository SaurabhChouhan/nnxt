import React from 'react'
import moment from 'moment'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import * as SC from '../../../server/serverconstants'

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
                                this.props.history.push("/app-home/release")
                                this.props.ReportingGoBack()
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>
                <TimelineEvent style={{fontSize: '20px'}}
                               title={"Project Name :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {selectedProject.project.name}
                </TimelineEvent>
                <TimelineEvent title={"Task Name :"} icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTask.task.name}
                </TimelineEvent>
                <TimelineEvent title={"Task Planned Date :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {moment(selectedTask.planningDate).format(SC.DATE_AND_TIME_FORMAT)}
                </TimelineEvent>
                <TimelineEvent title={"Task Planned Hours :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTask.planning.plannedHours}
                </TimelineEvent>
                <TimelineEvent title={"Task Reported Status :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTask.report.status}
                </TimelineEvent>
                <TimelineEvent title={"Task Description :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTask.task.description}
                </TimelineEvent>

            </Timeline>


        )
    }
}

export default ReportingTaskDetailPage;
