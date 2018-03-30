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
        this.state = {
            status: 'all',
            projectID: 'all'
        }
        this.filterEstimationByProject = this.filterEstimationByProject.bind(this);
    }

    onRowClick(row) {
        this.props.history.push("/app-home/estimation-detail")
        this.props.estimationSelected(row)

    }

    filterEstimationStatus(status) {
        this.props.getAllEstimations(this.state.projectID, status)
    }

    filterEstimationByProject(projectID) {
        this.props.getAllEstimations(projectID, this.state.status)
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
        const {projects, estimations, loggedInUser} = this.props
        return (
            <div key="estimation_list" className="clearfix">
                <div className="col-md-12">
                    <div className="col-md-8 estimationSearchSection">
                        <div className="col-md-4">
                            <select
                                className="form-control estimationSearchProject " onChange={(projectID) =>
                                this.filterEstimationByProject(projectID.target.value)
                            }>
                                {<option value="all">{'All Projects'}</option>}
                                {
                                    projects && projects.map(option => {

                                            return <option value={_.get(option, "_id")}
                                                           key={option["_id"]}>{_.get(option, 'name')}</option>
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div className="col-md-4">
                            <select className="form-control estimationSearchStatus" onChange={(status) =>
                                this.filterEstimationStatus(status.target.value)
                            }>
                                <option value="all">All Status</option>
                                <option value={SC.STATUS_ESTIMATION_REQUESTED}>{SC.STATUS_ESTIMATION_REQUESTED}</option>
                                <option value={SC.STATUS_INITIATED}>{SC.STATUS_INITIATED}</option>
                                <option value={SC.STATUS_PENDING}>{SC.STATUS_PENDING}</option>
                                <option value={SC.STATUS_APPROVED}>{SC.STATUS_APPROVED}</option>
                                <option value={SC.STATUS_REVIEW_REQUESTED}>{SC.STATUS_REVIEW_REQUESTED}</option>
                                <option value={SC.STATUS_CHANGE_REQUESTED}>{SC.STATUS_CHANGE_REQUESTED}</option>
                                <option value={SC.STATUS_REOPENED}>{SC.STATUS_REOPENED}</option>
                                <option value={SC.STATUS_PROJECT_AWARDED}>{SC.STATUS_PROJECT_AWARDED}</option>
                                <option value={SC.STATUS_REJECTED}>{SC.STATUS_REJECTED}</option>

                            </select>
                        </div>


                        <div className="col-md-4">
                            <div className="estimation ">
                                {this.props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                                <button className="btn customBtn estimationSearchInitiateBtn"
                                        onClick={() => this.props.showEstimationInitiateForm()}>Initiate Estimation
                                </button>}
                            </div>
                        </div>
                    </div>
                    <div className="estimation">
                        <BootstrapTable options={this.options} data={this.props.estimations}
                                        multiColumnSearch={true}
                                        search={true}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle width='10px' dataField='status'
                                               dataFormat={this.formatStatus}
                                               columnClassName={this.columnClassStatusFormat}></TableHeaderColumn>
                            <TableHeaderColumn columnTitle isKey dataField='_id' searchable={false}
                                               hidden={true}>ID</TableHeaderColumn>
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
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EstimationList)