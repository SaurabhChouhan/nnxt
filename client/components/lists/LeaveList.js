import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'
import {ConfirmationDialog} from "../index";

class LeaveList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showLeaveDeleteRequestDialog: false,
            row: {}
        };
    }

    onClose() {
        this.setState({
            showLeaveDeleteRequestDialog: false,
        })
    }

    rowClassNameFormat(row, rowIdx) {
        return row.status === SC.LEAVE_STATUS_APPROVED ? 'td-row-approved' : row.status === SC.LEAVE_STATUS_CANCELLED ? 'td-row-cancelled' : '';
    }

    formatCreatedDate(leave) {
        if (leave) {
            return moment(leave).format("DD-MM-YYYY ")
        }
        return ''
    }

    formatLeaveRaisedUser(user) {
        if (user && user.firstName) {
            return user.firstName + ' ' + user.lastName
        }
        return ''
    }

    formatLeaveApproverUser(user) {
        if (user && user.name) {
            return user.name
        }
        return ''
    }

    formatLeaveType(leaveType) {
        if (leaveType)
            return leaveType.name
        return ''
    }

    viewButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.props.history.push('/app-home/leave-detail')
                this.props.showLeaveDetails(row)
            }}>
                <i className="fa fa-eye"></i>
            </button>
        )
    }


    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button
                className=" btn btn-custom"
                disabled={!row.canDelete}
                type="button"
                onClick={() => {
                    this.setState({showLeaveDeleteRequestDialog: true, row: row})
                }}>
                <i className="fa fa-trash"></i>
            </button>
        )

    }

    viewCancelButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom " type="button"
                        disabled={!row.canCancel} onClick={() => {
                return this.props.cancelLeave(row)
            }}>
                <i className="fa fa-remove"></i>
            </button>
        )

    }

    viewApproveButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom"
                        type="button"
                        disabled={!row.canApprove}
                        onClick={() => {
                            return this.props.approveLeave(row)
                        }}>
                <i className="fa fa-check approveLeave"></i>
            </button>
        )

    }

    onConfirmDeleteRequest() {
        this.setState({showLeaveDeleteRequestDialog: false})
        this.props.deleteLeave(this.state.row)
    }


    render() {
        const {leaves, loggedInUser} = this.props
        return (
            <div>
                <div key="raise_leave_key" className="clearfix">


                    <div className="col-md-12 pad">

                        <div className="col-md-12">
                            <div className="col-md-12">
                                <div className="col-md-6">
                                    <div className="col-md-6">
                                        {
                                            loggedInUser && U.userHasOnlyRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) ? null :
                                                <button className="btn customBtn leaveBtn"
                                                        onClick={() => this.props.showRaiseLeaveForm()}>Raise-Leave
                                                </button>
                                        }
                                    </div>
                                    <div className="col-md-6  releaseSearchContent ">
                                        <div
                                            className={loggedInUser && U.userHasOnlyRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) ? "estimation releaseSelect  releaseSearchStatus leaveSelectHighestRole" : "estimation releaseSelect  releaseSearchStatus leaveSelect"}>
                                            <select className="form-control" title="Select Status"
                                                    onChange={(status) =>
                                                        this.props.changeLeaveStatus(status.target.value)
                                                    }>
                                                {
                                                    <option key={SC.ALL} value={SC.ALL}>All Status</option>
                                                }
                                                {
                                                    SC.ALL_LEAVE_STATUS_ARRAY.map(leave => <option key={leave}
                                                                                                   value={leave}>{leave}</option>)
                                                }
                                            </select>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div
                                className={loggedInUser && U.userHasOnlyRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) ? "estimation" : "estimation leave"}>

                                <BootstrapTable options={this.options} data={leaves}
                                                multiColumnSearch={true}
                                                search={true}
                                                striped={true}
                                                trClassName={this.rowClassNameFormat.bind(this)}
                                                hover={true}>
                                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                                       hidden={true}>ID</TableHeaderColumn>

                                    <TableHeaderColumn width="6%" dataField='button'
                                                       dataFormat={this.viewButton.bind(this)}>View
                                    </TableHeaderColumn>

                                    {loggedInUser && U.userHasRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) ?
                                        <TableHeaderColumn width="10%" columnTitle dataField='user'
                                                           dataFormat={this.formatLeaveRaisedUser.bind(this)}>Raised
                                            By
                                        </TableHeaderColumn>
                                        : <TableHeaderColumn width="8%" columnTitle dataField='created'
                                                             dataFormat={this.formatCreatedDate.bind(this)}>Created
                                        </TableHeaderColumn>
                                    }

                                    <TableHeaderColumn columnTitle width="8%" dataField='startDateString'
                                    >Start Date
                                    </TableHeaderColumn>

                                    <TableHeaderColumn columnTitle width="8%" dataField='endDateString'
                                    >End Date
                                    </TableHeaderColumn>

                                    <TableHeaderColumn width="8%" columnTitle dataField='dayType'>Day
                                        Type</TableHeaderColumn>

                                    <TableHeaderColumn columnTitle dataField='leaveType'
                                                       dataFormat={this.formatLeaveType.bind(this)}>
                                        Leave Type
                                    </TableHeaderColumn>

                                    <TableHeaderColumn width="10%" columnTitle
                                                       dataField='status'>Status</TableHeaderColumn>
                                    <TableHeaderColumn columnTitle width="17%" dataField='approver'
                                                       dataFormat={this.formatLeaveApproverUser.bind(this)}>Approver</TableHeaderColumn>

                                    {loggedInUser && U.userHasOnlyRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) ? null :
                                        <TableHeaderColumn width="7%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>
                                            Delete</TableHeaderColumn>}
                                    {loggedInUser && U.userHasRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) &&
                                    <TableHeaderColumn width="7%"
                                                       dataField='cancelButton'
                                                       dataFormat={this.viewCancelButton.bind(this)}>
                                        Cancel
                                    </TableHeaderColumn>}
                                    {loggedInUser && U.userHasRole(loggedInUser, SC.ROLE_TOP_MANAGEMENT) &&
                                    <TableHeaderColumn width="7%"
                                                       dataField='approveButton'
                                                       dataFormat={this.viewApproveButton.bind(this)}>
                                        Approve
                                    </TableHeaderColumn>}


                                </BootstrapTable>
                                {
                                    this.state && this.state.showLeaveDeleteRequestDialog &&
                                    <ConfirmationDialog show={true}
                                                        onConfirm={this.onConfirmDeleteRequest.bind(this)}
                                                        title="Leave Delete" onClose={this.onClose.bind(this)}
                                                        body="Are you sure you want to delete this leave. Please confirm!"/>
                                }
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(LeaveList)