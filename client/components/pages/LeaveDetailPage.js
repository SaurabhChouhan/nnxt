import React, {Component} from 'react'
import moment from 'moment'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import {withRouter} from 'react-router-dom'

class LeaveDetailPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {leave} = this.props
        console.log("leave", leave)
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
                {/*<TimelineEvent style={{fontSize: '20px'}}*/}
                {/*title={'Project Name :'}*/}
                {/*icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>*/}

                {/*{selectedRelease && selectedRelease.project && selectedRelease.project.name ? selectedRelease.project.name : ''}*/}
                {/*</TimelineEvent>*/}

                <div className="leaveRaiseDetail">
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Created Date:</b></div>
                        <div
                            className="col-md-7 leaveRaiseContent">{moment(leave.created).format("DD-MM-YYYY hh:mm:ss")} </div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Start Date:</b></div>
                        <div
                            className="col-md-7 leaveRaiseContent">{moment(leave.startDate).format("DD-MM-YYYY")}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>End Date: </b></div>
                        <div className="col-md-7 leaveRaiseContent">{moment(leave.endDate).format("DD-MM-YYYY")} </div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Leave Day Type:</b></div>
                        <div className="col-md-7 leaveRaiseContent">{leave.dayType}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Leave Type:</b></div>
                        <div className="col-md-7 leaveRaiseContent">{leave.leaveType.name}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Leave Status:</b></div>
                        <div className="col-md-7 leaveRaiseContent">{leave.status}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Leave Description:</b></div>
                        <div className="col-md-7 leaveRaiseContent">{leave.dayType}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Total Leave Days:</b></div>
                        <div className="col-md-7 leaveRaiseContent">{leave.numberOfLeaveDays}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-5 leaveRaiseTitle"><b>Leave Description:</b></div>
                        <div className="col-md-7 leaveRaiseContent">{leave.description}</div>
                    </div>
                </div>
            </Timeline>


        )
    }

}

export default withRouter(LeaveDetailPage)