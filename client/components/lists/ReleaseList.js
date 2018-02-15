import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
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

    }

    columnClassStatusFormat(status) {

        if (status == SC.STATUS_APPROVED)
            return 'appRowColor'

    }

    formatStatus(status) {
        return ''
    }

    formatProject(project) {
        if (project)
            return project.name
        return ''
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
                        <BootstrapTable options={this.options} data={this.props.estimations}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle width='10px' dataField='status'
                                               dataFormat={this.formatStatus}
                                               columnClassName={this.columnClassStatusFormat}></TableHeaderColumn>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='project'
                                               dataFormat={this.formatProject.bind(this)}>Project
                                Name</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='role'>Role</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='startdate'>Start Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='enddate'>End Date</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReleaseList