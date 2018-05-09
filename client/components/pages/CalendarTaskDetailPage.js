import React from 'react'
import moment from 'moment'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import * as SC from '../../../server/serverconstants'

class CalendarTaskDetailPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => this.props.showCalendarView()}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>
                <TimelineEvent style={{fontSize: '20px'}} title={this.props.selectedTaskDetail.title}
                               createdAt={moment(this.props.selectedTaskDetail.start).format(SC.DATE_AND_TIME_FORMAT) + " - "
                               + moment(this.props.selectedTaskDetail.end).format(SC.DATE_AND_TIME_FORMAT)}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    {this.props.selectedTaskDetail.description}
                </TimelineEvent>

            </Timeline>


        )
    }
}

export default CalendarTaskDetailPage;
