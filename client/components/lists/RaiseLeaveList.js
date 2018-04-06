import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import moment from 'moment'

class RaiseLeaveList extends Component {

    constructor(props) {
        super(props)
        // this.options = {
        //   onRowClick: this.onRowClick.bind(this)
        //  }

    }


    viewButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-eye btn btn-custom" type="button" onClick={() => {
                this.props.showRaiseLeaveDetail(row)
            }}>

            </button>
        )

    }


    //onRowClick(row) {

    //this.props.showRaiseLeaveDetail(row)

    //  }

    formatCreatedDate(leave) {
        if (leave) {
            return moment(leave).format("DD-MM-YYYY hh:mm:ss")
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

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-remove btn btn-custom " type="button"
                        disabled={(row.status == "cancelled") ? true : false} onClick={() => {
               return this.props.cancelRaiseLeaveRequestCall(row)
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
                                        <TableHeaderColumn columnTitle dataField='leaveType'
                                                           dataFormat={this.formatLeaveType.bind(this)}>Leave
                                            Type</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Cancel
                                            Leave</TableHeaderColumn>

                                        <TableHeaderColumn width="6%" dataField='button'
                                                           dataFormat={this.viewButton.bind(this)}>View
                                        </TableHeaderColumn>

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