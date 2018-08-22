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
        this.props.history.push("/app-home/release-plan")
        this.props.releaseSelected(row)

    }

    formatCreatedDate(row) {
        if (row) {
            return moment(row).format("DD-MM-YYYY")
        }
        return ''
    }

    formatProjectName(project, row, enumObject, rowIndex) {
        let releaseName = ""
        if (project && project.name)
            releaseName = project.name
        if (row && row.name)
            releaseName = releaseName + ' (' + row.name + ')'
        return releaseName
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

    formatEstimatedHours(column, row) {
        if (row.plannedStats) {
            return row.plannedStats.sumEstimatedHours
        }
        return ''
    }

    formatReportedHours(column, row) {
        if (row.plannedStats) {
            return row.plannedStats.sumReportedHours
        }
        return ''
    }

    formatProgress(column, row) {
        if (row.plannedStats) {
            return row.plannedStats.progress + '%'
        }
        return '0%'
    }

    formatStartDate(column, row) {
        if (row.iterations[0]) {
            return moment(row.iterations[0].devStartDate).format("DD-MM-YYYY")
        }
        return ''
    }

    formatEndDate(column, row) {
        if (row.iterations[0]) {
            return moment(row.iterations[0].devEndDate).format("DD-MM-YYYY")
        }
        return ''
    }


    formatReleaseDate(column, row) {
        if (row.iterations[0]) {
            return moment(row.iterations[0].clientReleaseDate).format("DD-MM-YYYY")
        }
        return ''
    }

    render() {
        const {releases} = this.props
        return ([
                <div key={"release-search"} className="col-md-12 release-options">
                    <button type="button" className="col-md-2 btn customBtn" onClick={
                        () => {
                            this.props.showCreateReleaseDialog()
                        }}>Create Release
                    </button>
                    <div className="search-btn-container">
                        <select className="col-md-4 form-control" title="Select Status"
                                onChange={(status) =>
                                    this.props.changeReleaseStatus(status.target.value)
                                }>
                            <option value={SC.ALL}>All Status</option>

                            <option value={SC.STATUS_PLAN_REQUESTED}>{SC.STATUS_PLAN_REQUESTED}</option>
                            <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                            <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                            <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
                            <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                        </select>
                    </div>
                </div>,
                <div key={"release-table"} className="col-md-12">
                    <div className="estimation release-plan-table">
                        <BootstrapTable options={this.options} data={releases}
                                        multiColumnSearch={true}
                                        search={false}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn width="12%" dataField='project'
                                               dataFormat={this.formatProjectName.bind(this)} dataAlign={"center"}>
                                Project
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='manager'
                                               dataFormat={this.formatManager.bind(this)} dataAlign={"center"}>
                                Manager
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='leader'
                                               dataFormat={this.formatLeader.bind(this)} dataAlign={"center"}>
                                Leader
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatEstimatedHours.bind(this)} dataAlign={"center"}>
                                Estimated Hours
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatReportedHours.bind(this)} dataAlign={"center"}>
                                Reported Hours
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatProgress.bind(this)} dataAlign={"center"}>
                                Progress
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatStartDate.bind(this)} dataAlign={"center"}>
                                Start Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatEndDate.bind(this)} dataAlign={"center"}>
                                End Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatReleaseDate.bind(this)} dataAlign={"center"}>
                                Release Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status' dataAlign={"center"}>
                                Status
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>]
        )
    }
}

export default withRouter(ReleaseList)
