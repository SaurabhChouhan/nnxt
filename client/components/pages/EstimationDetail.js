import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'

class EstimationDetail extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return <div>
            <div className="row">
                <div className="col-md-1">Project:</div>
                <div className="col-md-1">NNXT</div>

                <div className="col-md-1 col-md-offset-6">Client:</div>
                <div className="col-md-1">Mike</div>
            </div>
            <div className="row" style={{marginTop: 10}}>
                <div className="col-md-3">
                    {
                        this.props.loggedInUser.roleNames.includes(SC.ROLE_ESTIMATOR) &&
                        <button className="btn btn-default btn-submit addBtn"
                                onClick={() => this.props.showAddTaskForm()}>Add Task
                        </button>
                    }
                    {this.props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                    <button className="btn btn-default btn-submit addBtn"
                            onClick={() => this.props.sendToEstimator()}>Send to Estimator
                    </button>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-md-10">
                    <BootstrapTable options={this.options} data={this.props.tasks}
                                    striped={true}
                                    hover={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField='project'>Project</TableHeaderColumn>
                        <TableHeaderColumn dataField='client'>Client</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        </div>
    }

}

export default EstimationDetail