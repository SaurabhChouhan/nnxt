import React, {Component} from 'react'
import moment from 'moment'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

class RaiseLeaveDeatilPage extends Component {
    constructor(props) {
        super(props)

    }


    render() {
        const {raiseLeave} = this.props
        console.log("raiseLeave", raiseLeave)
        return (
            <div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Created Date:</b></div>
                    <div className="col-md-8">{moment(raiseLeave.created).format("DD-MM-YYYY hh:mm:ss")} </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Start Date:</b></div>
                    <div className="col-md-8">{moment(raiseLeave.startDate).format("DD-MM-YYYY")}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>End Date: </b></div>
                    <div className="col-md-8">{moment(raiseLeave.endDate).format("DD-MM-YYYY")} </div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Leave Day Type:</b></div>
                    <div className="col-md-8">{raiseLeave.dayType}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Leave Type:</b></div>
                    <div className="col-md-8">{raiseLeave.leaveType.name}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Leave Status:</b></div>
                    <div className="col-md-8">{raiseLeave.status}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Leave Description:</b></div>
                    <div className="col-md-8">{raiseLeave.dayType}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Total Leave Days:</b></div>
                    <div className="col-md-8">{raiseLeave.numberOfLeaveDays}</div>
                </div>
                <div className="col-md-12">
                    <div className="col-md-4"><b>Leave Description:</b></div>
                    <div className="col-md-8">{raiseLeave.description}</div>
                </div>
            </div>
        )
    }

}

export default RaiseLeaveDeatilPage