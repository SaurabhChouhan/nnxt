import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'


class ReleaseList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }

    }

    onRowClick(row) {
        // this.props.history.push("/app-home/release-detail")

    }

    columnClassStatusFormat(status) {

        if (status == SC.STATUS_APPROVED)
            return 'appRowColor'

    }

    formatStatus(status) {
        return ''
    }

    formatUser(row) {
        return row.firstName + ' ' + row.lastName
    }

    formateProjectName(project) {
        if (project)
            return project.name
        return ''
    }

    formateCreatedDate(row) {
        return moment(row).format("DD-MM-YYYY")
    }

    formateStartDate(row) {
        return moment(row).format("DD-MM-YYYY")
    }

    formateEndDate(row) {
        return moment(row).format("DD-MM-YYYY")
    }

    formateReleaseDate(row) {
        return moment(row).format("DD-MM-YYYY")
    }



    render() {
        return (
            <div key="estimation_list" className="clearfix">
                <div className="col-md-12">
                    <div className="col-md-12 pad">
                        <div className="col-md-6 pad">
                            <div className="search">
                                <input type="text" className="form-control" placeholder="Search Features/Tasks"/>
                                <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="estimation">
                                <select className="form-control">
                                    <option value="">All</option>
                                    <option value="">project1</option>
                                    <option value="">project2</option>
                                    <option value="">project3</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="estimation">
                        <BootstrapTable options={this.options} data={this.props.releases}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle width='10px' dataField='status'
                                               dataFormat={this.formatStatus}
                                               columnClassName={this.columnClassStatusFormat}></TableHeaderColumn>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='created'
                                               dataFormat={this.formateCreatedDate.bind(this)}>
                                Created </TableHeaderColumn>
                            <TableHeaderColumn columnTitle={"Project Name"} dataField='project'
                                               dataFormat={this.formateProjectName.bind(this)}>
                                Project </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='manager'
                                               dataFormat={this.formatUser.bind(this)}> Manager
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='leader'
                                               dataFormat={this.formatUser.bind(this)}> Leader
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial.devStartDate'
                                               dataFormat={this.formateStartDate.bind(this)}>Start
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial.devEndDate'
                                               dataFormat={this.formateEndDate.bind(this)}>End
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial.clientReleaseDate'
                                               dataFormat={this.formateReleaseDate.bind(this)}>Release
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReleaseList