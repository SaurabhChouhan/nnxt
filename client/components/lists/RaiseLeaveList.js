import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import Moment from 'moment'
import {ConfirmationDialog} from "../index";
import * as SC from '../../../server/serverconstants'
import {showComponentHideOthers} from "../../actions";
import {PROJECT_FORM_DIALOG} from "../componentConsts";

class RaiseLeaveList extends Component {

    constructor(props) {
        super(props)

    }

    formatFrom(leave) {
        if (leave) {
            return Moment(leave.from).format("DD-MM-YYYY")
        }
        return ''
    }

    formatTo(leave) {
        if (leave)
            return Moment(leave.to).format("DD-MM-YYYY")
        return ''
    }

    formatType(leave) {
        if (leave)
            return leave.type
        return ''
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-remove btn btn-custom " type="button" disabled={(row.status=="cancelled")?true : false} onClick={() => {
                console.log("delete button call", row)
                this.props.cancelRaiseLeaveRequestCall(row)
            }}>

            </button>
        )

    }

    render() {
        return (
            <div>
                <div key="raise_leave_key" className="clearfix">

                    <div className="col-md-12">
                        <div className="col-md-12 pad">

                            <div className="col-md-12">
                                <button className="btn customBtn"
                                        onClick={() => this.props.showRaiseLeaveForm()}>Raise-Leave
                                </button>

                                <div className="raiseLeave">

                                    <BootstrapTable options={this.options} data={this.props.leaveRequests}
                                                    striped={true}
                                                    hover={true}>
                                        <TableHeaderColumn columnTitle isKey dataField='_id'
                                                           hidden={true}>ID</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='leave'
                                                           dataFormat={this.formatFrom.bind(this)}>Date
                                            From</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='leave'
                                                           dataFormat={this.formatTo.bind(this)}>Date
                                            To</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='leave'
                                                           dataFormat={this.formatType.bind(this)}>Type</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Cancel Leave</TableHeaderColumn>

                                    </BootstrapTable>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(RaiseLeaveList)