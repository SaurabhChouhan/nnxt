import React from 'react'
import moment from 'moment'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import * as SC from '../../../server/serverconstants'

class CalendarTaskDetailPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {selectedTaskDetail} = this.props
        return (
            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => this.props.showCalendarView()}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>
                {selectedTaskDetail && selectedTaskDetail.task.name ?
                    <TimelineEvent style={{fontSize: '20px'}}
                                   title={"Task Name :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                        {selectedTaskDetail.task.name}
                    </TimelineEvent>
                    : null
                }

                <TimelineEvent style={{fontSize: '20px'}}
                               title={"Planning date :"}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    {moment(selectedTaskDetail.start).format(SC.DATE_AND_TIME_FORMAT) + " - " + moment(selectedTaskDetail.end).format(SC.DATE_AND_TIME_FORMAT)}
                </TimelineEvent>

                {selectedTaskDetail && selectedTaskDetail.report.status ?
                    <TimelineEvent style={{fontSize: '20px'}}
                                   title={"Status :"}
                                   icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                        {selectedTaskDetail.report.status}
                    </TimelineEvent>
                    : null
                }

            </Timeline>


        )
    }
}

export default CalendarTaskDetailPage;
