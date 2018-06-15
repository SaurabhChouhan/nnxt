import React, {Component} from 'react'
import moment from 'moment'

class LeaveDetailPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {leave} = this.props
        return (
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
        )
    }

}

export default LeaveDetailPage