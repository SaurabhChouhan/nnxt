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
        return 'statusLableTdColor'
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
                <div className="col-md-12 ">
                    <div className="estimation">
                        <table className="table table-bordered table-striped">
                            <tr>
                                <th className="tblcolor"></th>
                                <th>Project Name</th>
                                <th>Technologies</th>
                                <th>Total Hours</th>
                                <th>Project Description</th>
                                <th> Estimator</th>
                                <th>Negotiator</th>
                            </tr>
                            <tr>
                                <td className="rowparrotcolor"></td>
                                <td>LumaBooth(Approved)</td>
                                <td>Technology</td>
                                <td>20</td>
                                <td>Project Description</td>
                                <td>
                                    <div className="estimationuser"><span>SC</span></div>
                                </td>
                                <td>
                                    <div className="estimationuser"><span>MP</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="rowgreencolor"></td>
                                <td>LumaBooth(Approved)</td>
                                <td>Technology</td>
                                <td>20</td>
                                <td>Project Description</td>
                                <td>
                                    <div className="estimationuser"><span>SC</span></div>
                                </td>
                                <td>
                                    <div className="estimationuser"><span>MP</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="rowbluecolor"></td>
                                <td>LumaBooth(Approved)</td>
                                <td>Technology</td>
                                <td>20</td>
                                <td>Project Description</td>
                                <td>
                                    <div className="estimationuser"><span>SC</span></div>
                                </td>
                                <td>
                                    <div className="estimationuser"><span>MP</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="rowyellowcolor"></td>
                                <td>LumaBooth(Approved)</td>
                                <td>Technology</td>
                                <td>20</td>
                                <td>Project Description</td>
                                <td>
                                    <div className="estimationuser"><span>SC</span></div>
                                </td>
                                <td>
                                    <div className="estimationuser"><span>MP</span></div>
                                </td>
                            </tr>
                            <tr>
                                <td className="rowbrowncolor"></td>
                                <td>LumaBooth(Approved)</td>
                                <td>Technology</td>
                                <td>20</td>
                                <td>Project Description</td>
                                <td>
                                    <div className="estimationuser"><span>SC</span></div>
                                </td>
                                <td>
                                    <div className="estimationuser"><span>MP</span></div>
                                </td>
                            </tr>


                        </table>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="estimation">
                        {this.props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                        <button className="btn btn-default btn-submit addBtn"
                                onClick={() => this.props.showEstimationInitiateForm()}>Initiate Estimation
                        </button>}

                        <BootstrapTable options={this.options} data={this.props.estimations}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn width='20px' dataField='statusLable'
                                               columnClassName={this.columnClassStatusFormat}></TableHeaderColumn>
                            <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn dataField='project'
                                               dataFormat={this.formatProject.bind(this)}>Project
                                Name</TableHeaderColumn>
                            <TableHeaderColumn dataField='client'
                                               dataFormat={this.formatClient.bind(this)}>Client</TableHeaderColumn>
                            <TableHeaderColumn dataField='technologies'
                                               dataFormat={this.formatTechnologies.bind(this)}>Technologies</TableHeaderColumn>
                            <TableHeaderColumn dataField='totalHours'
                                               dataFormat={this.formatClient.bind(this)}>Total Hours</TableHeaderColumn>
                            <TableHeaderColumn dataField='description'
                                               dataFormat={this.formatProjectDescription.bind(this)}>Project
                                Description</TableHeaderColumn>
                            <TableHeaderColumn dataField='estimator'
                                               dataFormat={this.formatEstimator.bind(this)}>Estimator</TableHeaderColumn>
                            <TableHeaderColumn dataField='negotiator'
                                               dataFormat={this.formatNegotiator.bind(this)}>Negotiator</TableHeaderColumn>
                            <TableHeaderColumn dataField='status'>Status</TableHeaderColumn>
                            <TableHeaderColumn width="10%" dataField='button'
                                               dataFormat={this.viewButton.bind(this)}></TableHeaderColumn>

                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(EstimationList)