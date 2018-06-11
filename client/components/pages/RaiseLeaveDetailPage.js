import React, {Component} from 'react'
import moment from 'moment'

class RaiseLeaveDetailPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {raiseLeave} = this.props
        return (
            <div className="leaveRaiseDetail">
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Created Date:</b></div>
                    <div
                        className="col-md-7 leaveRaiseContent">{moment(raiseLeave.created).format("DD-MM-YYYY hh:mm:ss")} </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Start Date:</b></div>
                    <div
                        className="col-md-7 leaveRaiseContent">{moment(raiseLeave.startDate).format("DD-MM-YYYY")}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>End Date: </b></div>
                    <div className="col-md-7 leaveRaiseContent">{moment(raiseLeave.endDate).format("DD-MM-YYYY")} </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Leave Day Type:</b></div>
                    <div className="col-md-7 leaveRaiseContent">{raiseLeave.dayType}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Leave Type:</b></div>
                    <div className="col-md-7 leaveRaiseContent">{raiseLeave.leaveType.name}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Leave Status:</b></div>
                    <div className="col-md-7 leaveRaiseContent">{raiseLeave.status}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Leave Description:</b></div>
                    <div className="col-md-7 leaveRaiseContent">{raiseLeave.dayType}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Total Leave Days:</b></div>
                    <div className="col-md-7 leaveRaiseContent">{raiseLeave.numberOfLeaveDays}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-5 leaveRaiseTitle"><b>Leave Description:</b></div>
                    <div className="col-md-7 leaveRaiseContent">{raiseLeave.description}</div>
                </div>
            </div>
        )
    }

}

export default RaiseLeaveDetailPage