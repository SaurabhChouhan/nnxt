import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'

import {withRouter} from 'react-router-dom'


class ReleaseList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }

    }

    onRowClick(row) {
        this.props.history.push("/app-home/release-detail")
        this.props.projectSelected(row)

    }

    columnClassStatusFormat(status) {
        if (status == SC.STATUS_APPROVED)
            return 'appRowColor'
    }

    formatStatus(status) {
        return ''
    }

    formatManager(row) {
        if (row) {
            return row.firstName + ' ' + row.lastName
        }
        return ''

    }

    formatLeader(row) {
        if (row) {
            return row.firstName + ' ' + row.lastName
        }
        return ''

    }

    formateProjectName(project) {
        if (project)
            return project.name
        return ''
    }

    formatCreatedDate(row) {
        if (row) {
            return moment(row).format("DD-MM-YYYY")
        }
        return ''

    }

    formatStartDate(row) {
        if (row) {
            return moment(row.devStartDate).format("DD-MM-YYYY")
        }
        return ''

    }

    formatEndDate(row) {
        if (row) {
            return moment(row.devEndDate).format("DD-MM-YYYY")
        }
        return ''

    }

    formatReleaseDate(row) {
        if (row) {
            return moment(row.clientReleaseDate).format("DD-MM-YYYY")
        }
        return ''

    }

    formatHours(row) {
        if (row) {
            return row.billedHours
        }
        return ''

    }


    render() {
        return (
            <div key="estimation_list" className="clearfix">
                <div className="col-md-12">
                    <div className="col-md-12 pad">
                        <div className="col-md-6 pad">
                            <div className="search">
                                <input type="text" className="form-control" placeholder="Search Project Names"/>
                                <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="estimation">
                                <select className="form-control" onChange={(status) =>
                                    this.props.changeReleaseStatus(status.target.value)
                                }>
                                    <option value="all">All</option>
                                    <option value={SC.STATUS_PLAN_REQUESTED}>{SC.STATUS_PLAN_REQUESTED}</option>
                                    <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                                    <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                                    <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
                                    <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                                    <option value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="estimation">
                        <BootstrapTable options={this.options} data={this.props.releases}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='created'
                                               dataFormat={this.formatCreatedDate.bind(this)}>
                                Created </TableHeaderColumn>
                            <TableHeaderColumn columnTitle={"Project Name"} dataField='project'
                                               dataFormat={this.formateProjectName.bind(this)}>
                                Project </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='manager'
                                               dataFormat={this.formatManager.bind(this)}> Manager
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='leader'
                                               dataFormat={this.formatLeader.bind(this)}> Leader
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial'
                                               dataFormat={this.formatHours.bind(this)}> Billed Hours
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial'
                                               dataFormat={this.formatStartDate.bind(this)}>Start
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial'
                                               dataFormat={this.formatEndDate.bind(this)}>End
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial'
                                               dataFormat={this.formatReleaseDate.bind(this)}>Release
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ReleaseList)


/*<TableHeaderColumn columnTitle width='10px' dataField='status'
                                               dataFormat={this.formatStatus}
                                               columnClassName={this.columnClassStatusFormat}></TableHeaderColumn>*/