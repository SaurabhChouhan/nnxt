import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import _ from 'lodash'

class EstimationList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }
    }

    onRowClick(row) {
        this.props.history.push("/app-home/estimation-detail")
        this.props.estimationSelected(row)

    }

    formatProject(project) {
        if (project)
            return project.name
        return ''
    }

    columnClassStatusFormat(status) {
        if (status == SC.STATUS_ESTIMATION_REQUESTED)
            return 'erRowColor'
        if (status == SC.STATUS_INITIATED)
            return 'inRowColor'
        if (status == SC.STATUS_PENDING)
            return 'penRowColor'
        if (status == SC.STATUS_APPROVED)
            return 'appRowColor'
        if (status == SC.STATUS_REVIEW_REQUESTED)
            return 'rrRowColor'
        if (status == SC.STATUS_CHANGE_REQUESTED)
            return 'crRowColor'
        if (status == SC.STATUS_REOPENED)
            return 'roRowColor'
        if (status == SC.STATUS_PROJECT_AWARDED)
            return 'paRowColor'
        if (status == SC.STATUS_REJECTED)
            return 'rejRowColor'
        return ''
    }

    formatStatus(status) {
        return ''
    }


    columnClassUserFormat(user) {
        return 'estimationListUser'
    }

    formatClient(client) {
        if (client)
            return client.name
        return ''
    }

    formatTechnologies(technologies) {
        if (Array.isArray(technologies))
            return _.join(technologies)
        return ''
    }

    formatProjectDescription(description) {
        if (description)
            return description
        return ''
    }

    formatEstimator(estimator) {
        if (estimator)
            return estimator.firstName
        return ''
    }

    formatNegotiator(negotiator) {
        if (negotiator)
            return negotiator.firstName
        return ''
    }


    viewButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-th-list pull-left btn btn-custom" type="button">
            </button>
        )
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
                        <div className="col-md-3 pad">
                            <div className="estimation">
                                {this.props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                                <button className="btn customBtn"
                                        onClick={() => this.props.showEstimationInitiateForm()}>Initiate Estimation
                                </button>}
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
                            <TableHeaderColumn columnTitle dataField='client'
                                               dataFormat={this.formatClient.bind(this)}>Client</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='technologies'
                                               dataFormat={this.formatTechnologies.bind(this)}>Technologies</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='totalHours'
                                               dataFormat={this.formatClient.bind(this)}>Total Hours</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='description'
                                               dataFormat={this.formatProjectDescription.bind(this)}>Project
                                Description</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='estimator'
                                               columnClassName={this.columnClassUserFormat}
                                               dataFormat={this.formatEstimator.bind(this)}>Estimator</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='negotiator'
                                               columnClassName={this.columnClassUserFormat}
                                               dataFormat={this.formatNegotiator.bind(this)}>Negotiator</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                            <TableHeaderColumn columnTitle width="10%" dataField='button'
                                               dataFormat={this.viewButton.bind(this)}></TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EstimationList)