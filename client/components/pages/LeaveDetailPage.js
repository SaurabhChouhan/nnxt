import React, {Component} from 'react'
import moment from 'moment'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import * as SC from '../../../server/serverconstants'
import _ from 'lodash'
import {withRouter} from 'react-router-dom'

class LeaveDetailPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {leave} = this.props
        console.log("leave", leave)
        var approval = leave && leave.status && ( leave.status === SC.LEAVE_STATUS_APPROVED || leave.status === SC.LEAVE_STATUS_CANCELLED )
        return (
            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => {
                                this.props.history.push('/app-home/leave')
                                this.props.leaveGoBack()
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>
                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Created Date:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.created ? moment(leave.created).format("DD-MM-YYYY hh:mm:ss") : ''}
                </TimelineEvent>

                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Start Date:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.startDateString && !_.isEmpty(leave.startDateString) ? leave.startDateString : ''}
                </TimelineEvent>

                <TimelineEvent style={{fontSize: '20px'}}
                               title={'End Date:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.endDateString && !_.isEmpty(leave.endDateString) ? leave.endDateString : ''}
                </TimelineEvent>

                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Total Leave Days:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.numberOfLeaveDays ? leave.numberOfLeaveDays : ''}
                </TimelineEvent>


                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Leave Day Type:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    {leave && leave.dayType ? leave.dayType : ''}
                </TimelineEvent>

                <TimelineEvent style={leave.status === SC.LEAVE_STATUS_APPROVED ? {
                    color: "green",
                    fontSize: '20px'
                } : leave.status === SC.LEAVE_STATUS_CANCELLED ? {color: "red", fontSize: '20px'} : {fontSize: '20px'}}
                               title={'Leave Status:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.status ? leave.status : ''}
                </TimelineEvent>

                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Leave Raised By:'}
                               icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}>

                    {leave && leave.user && leave.user.firstName ? leave.user.firstName + " " + leave.user.lastName : ''}
                </TimelineEvent>

                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Leave Type:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.leaveType && leave.leaveType.name ? leave.leaveType.name : ''}
                </TimelineEvent>


                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Leave Description:'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {leave && leave.description ? leave.description : ''}
                </TimelineEvent>
                {approval ?
                    <TimelineEvent title={'Leave Approval :'}
                                   icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}
                                   style={{fontSize: '20px'}}>
                        <Timeline>
                            <TimelineEvent style={{fontSize: '20px'}}
                                           title={leave.status === SC.LEAVE_STATUS_APPROVED ? 'APPROVED BY:' : "REJECTED BY:"}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                                {leave && leave.approver && leave.approver.name ? leave.approver.name : ''}
                            </TimelineEvent>
                            <TimelineEvent style={{fontSize: '20px'}}
                                           title={'REASON:'}
                                           icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                                {leave && leave.approver && leave.approver.reason ? leave.approver.reason : ''}
                            </TimelineEvent>
                        </Timeline>
                    </TimelineEvent> : <span></span>
                }

            </Timeline>


        )
    }

}

export default withRouter(LeaveDetailPage)