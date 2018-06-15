import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'

class LeaveList extends Component {

    constructor(props) {
        super(props)
    }


    formatCreatedDate(leave) {
        if (leave) {
            return moment(leave).format("DD-MM-YYYY ")
        }
        return ''
    }

    formatStartDate(leave) {

        if (leave) {

            return moment(leave).format("DD-MM-YYYY")
        }
        return ''
    }

    formatEndDate(leave) {
        if (leave)
            return moment(leave).format("DD-MM-YYYY")
        return ''
    }

    formatLeaveType(leaveType) {
        if (leaveType)
            return leaveType.name
        return ''
    }

    viewButton(cell, row, enumObject, rowIndex) {
        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.props.showLeaveDetails(row)
            }}>
                <i className="fa fa-eye"></i>
            </button>
        )

    }




    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.props.deleteLeave(row)
            }}>
                <i className="fa fa-trash"></i>
            </button>
        )

    }


    render() {
        const {leaves} = this.props
        return (
            <div>
                <div key="raise_leave_key" className="clearfix">

                    <div className="col-md-12">
                        <div className="col-md-12 pad">

                            <div className="col-md-12">
                                <div className="col-md-12">
                                    <div className="col-md-6">
                                        <button className="btn customBtn"
                                                onClick={() => this.props.showRaiseLeaveForm()}>Raise-Leave
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="col-md-4  releaseSearchContent ">
                                            <div className="estimation releaseSelect  releaseSearchStatus">
                                                <select className="form-control" title="Select Status"
                                                        onChange={(status) =>
                                                            this.props.changeLeaveStatus(status.target.value)
                                                        }>
                                                    <option value="all">All Status</option>
                                                    <option value={SC.STATUS_PENDING}>{SC.STATUS_PENDING}</option>
                                                    <option value={SC.STATUS_APPROVED}>{SC.STATUS_APPROVED}</option>
                                                    <option value={SC.STATUS_CANCELLED}>{SC.STATUS_CANCELLED}</option>
                                                    <option value={SC.STATUS_REJECTED}>{SC.STATUS_REJECTED}</option>
                                                </select>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="estimation">

                                    <BootstrapTable options={this.options} data={leaves}
                                                    striped={true}
                                                    hover={true}>
                                        <TableHeaderColumn columnTitle isKey dataField='_id'
                                                           hidden={true}>ID</TableHeaderColumn>
                                        <TableHeaderColumn width="8%" dataField='button'
                                                           dataFormat={this.viewButton.bind(this)}>View
                                        </TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='created'
                                                           dataFormat={this.formatCreatedDate.bind(this)}>Created
                                        </TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='startDate'
                                                           dataFormat={this.formatStartDate.bind(this)}>Start Date
                                        </TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='endDate'
                                                           dataFormat={this.formatEndDate.bind(this)}>End Date
                                        </TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='dayType'>Day Type</TableHeaderColumn>
                                        <TableHeaderColumn width="25%" columnTitle dataField='leaveType'
                                                           dataFormat={this.formatLeaveType.bind(this)}>Leave
                                            Type</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                                        <TableHeaderColumn width="10%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Delete
                                            Leave</TableHeaderColumn>
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

export default withRouter(LeaveList)