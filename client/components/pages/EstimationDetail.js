import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import Dialog from 'react-bootstrap-dialog'
import {ConfirmationDialog} from "../"

class EstimationDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showEstimationRequestDialog: false
        }
    }

    onClose() {
        this.setState({showEstimationRequestDialog: false})
    }

    onConfirmEstimationRequest() {
        this.setState({showEstimationRequestDialog: false})
        console.log("onConfirmationEstimationRequest")
        this.props.sendEstimationRequest(this.props.estimation)
    }

    render() {
        const {estimation} = this.props
        return <div>
            {this.state.showEstimationRequestDialog &&
            <ConfirmationDialog show={true} onConfirm={this.onConfirmEstimationRequest.bind(this)}
                                title="Estimation Request" onClose={this.onClose.bind(this)}
                                body="You are about to send 'Estimation Request' to Estimator of this Estimation. Please confirm!"/>
            }
            <div className="row">
                <div className="col-md-1">Project:</div>
                <div className="col-md-1">{estimation.project.name}</div>

                <div className="col-md-1">Client:</div>
                <div className="col-md-1">{estimation.client.name}</div>

                <div className="col-md-1 col-md-offset-2">Status:</div>
                <div className="col-md-3">{estimation.status}</div>
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
                            onClick={() => this.setState({showEstimationRequestDialog: true})}>Send to Estimator
                    </button>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-md-10">
                    <BootstrapTable options={this.options} data={estimation.tasks}
                                    striped={true}
                                    hover={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField='name'>Task Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='description'>Task Description</TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        </div>
    }

}

export default EstimationDetail