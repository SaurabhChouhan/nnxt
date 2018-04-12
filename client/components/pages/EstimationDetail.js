import React, {Component} from 'react'
import * as SC from '../../../server/serverconstants'
import {ConfirmationDialog} from "../"
import {EstimationFeaturesContainer, EstimationTasksContainer, RepositorySearchContainer} from "../../containers"
import * as logger from '../../clientLogger'
import _ from 'lodash'


class EstimationDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEstimationRequestDialog: false,
            showEstimationApproveDialog: false
        };
    }

    onClose() {
        this.setState({
            showEstimationRequestDialog: false,
            showEstimationReviewDialog: false,
            showEstimationChangeDialog: false,
            showEstimationApproveDialog: false,
            showEstimationReopenDialog: false
        })
    }

    onConfirmEstimationApprove() {
        this.setState({showEstimationApproveDialog: false})
        this.props.estimationApprove(this.props.estimation)
    }

    onConfirmEstimationRequest() {
        this.setState({showEstimationRequestDialog: false})
        this.props.sendEstimationRequest(this.props.estimation)
    }

    onConfirmReviewRequest() {
        this.setState({showEstimationReviewDialog: false})
        this.props.sendReviewRequest(this.props.estimation)
    }

    onConfirmChangeRequest() {
        this.setState({showEstimationChangeDialog: false})
        this.props.sendChangeRequest(this.props.estimation)
    }

    onConfirmReopen() {
        this.setState({showEstimationReopenDialog: false})
        this.props.reopenEstimation(this.props.estimation)
    }


    render() {
        logger.debug(logger.ESTIMATION_DETAIL_RENDER, this.props)
        const {estimation} = this.props;
        let editView = false
        if ((estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status)) || (estimation.loggedInUserRole == SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))) {
            editView = true
        }

        return <div>
            <div className="col-md-8 pad">
                <div className="col-md-12 estimateheader">
                    {estimation.canApprove && estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && estimation.status == SC.STATUS_REVIEW_REQUESTED ?
                        <div className="col-md-5 pad">

                            <div className="col-md-6 backarrow estimationBackArrow">
                                <h5>
                                    <button title="Go Back" className="btn-link pad" onClick={() => {
                                        this.props.history.push("/app-home/estimation")
                                        this.props.estimationGoBack()
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>

                                    <b>{estimation.project ? estimation.project.name : ''}</b>
                                </h5>
                            </div>
                            <div className="col-md-6">
                                <button className="btn approveBtn"
                                        onClick={() => this.setState({showEstimationApproveDialog: true})}>Approve
                                    Estimation
                                </button>
                            </div>
                        </div>
                        : <div className="col-md-5 pad">

                            <div title="Go Back" className="col-md-5 backarrow estimationBackArrow">
                                <h5>
                                    <button className="btn-link pad" onClick={() => {
                                        this.props.history.push("/app-home/estimation")
                                        this.props.estimationGoBack()
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>

                                    <b>{estimation.project ? estimation.project.name : ''}</b>
                                </h5>
                            </div>
                            {
                                (_.includes([SC.STATUS_INITIATED], estimation.status) && estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR ) &&
                                <button type="button" className="btn customBtn" onClick={() => {
                                    this.props.editEstimationInitiateForm(estimation)
                                }
                                }>Edit Estimation</button>

                            }
                        </div>


                    }
                    {
                        this.state.showEstimationRequestDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmEstimationRequest.bind(this)}
                                            title="Estimation Request" onClose={this.onClose.bind(this)}
                                            body="You are about to send 'Estimation Request' to Estimator of this Estimation. Please confirm!"/>
                    }
                    {
                        this.state.showEstimationApproveDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmEstimationApprove.bind(this)}
                                            title="Estimation Approve" onClose={this.onClose.bind(this)}
                                            body="Are you sure you want to approve this estimation. Please confirm!"/>
                    }

                    {
                        this.state.showEstimationChangeDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmChangeRequest.bind(this)}
                                            title="Change Request" onClose={this.onClose.bind(this)}
                                            body="You are about to send 'Change Request' to Estimator of this Estimation. Please confirm!"/>
                    }

                    {
                        this.state.showEstimationReviewDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmReviewRequest.bind(this)}
                                            title="Estimation Request" onClose={this.onClose.bind(this)}
                                            body="You are about to send 'Review Request' to Negotiator of this Estimation. Please confirm!"/>
                    }
                    {
                        this.state.showEstimationReopenDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmReopen.bind(this)}
                                            title="Estimation Reopen" onClose={this.onClose.bind(this)}
                                            body="Are you sure you want to reopen this estimation. Please confirm!"/>
                    }


                    <div className="col-md-3">
                        {
                            estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && estimation.status == SC.STATUS_INITIATED &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationRequestDialog: true})}>Request
                                Estimation
                            </button>
                        }
                        {

                            estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && estimation.status == SC.STATUS_APPROVED &&
                            <button className="btn reopenBtn"
                                    onClick={() => this.setState({showEstimationReopenDialog: true})}>Reopen
                                Estimation
                            </button>
                        }
                        {
                            estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && estimation.status == SC.STATUS_REVIEW_REQUESTED &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationChangeDialog: true})}>Request Change
                            </button>
                        }

                        {
                            estimation.loggedInUserRole == SC.ROLE_ESTIMATOR && (estimation.status == SC.STATUS_ESTIMATION_REQUESTED || estimation.status == SC.STATUS_CHANGE_REQUESTED) &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationReviewDialog: true})}>Request
                                Review
                            </button>
                        }

                    </div>
                    <div className="col-md-1">
                        < button type="button" className="btn customBtn deleteEstimationBtn" onClick={() => {
                            this.props.deleteEstimation(estimation)
                        }
                        }><i className="fa fa-trash iconClr "></i></button>
                    </div>

                    <div className="col-md-3 pad ">
                        <div className="estimationfileoption">
                            <ul className="list-unstyled">
                                {(_.includes([SC.STATUS_REVIEW_REQUESTED, SC.STATUS_APPROVED, SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED, SC.STATUS_REOPENED], estimation.status))
                                &&
                                < button type="button" className="btn customBtn filterAlign" onClick={() => {
                                    this.props.estimationFilterForm()
                                }
                                }>filter</button>
                                }

                                <li><a href=""> <i className="fa fa-file-pdf-o"></i></a></li>
                                <li><a href=""> <i className="fa fa-file-word-o"></i></a></li>
                                <li><a href=""> <i className=" fa fa-file-excel-o"></i></a></li>
                                <li><a href=""> <i className="glyphicon glyphicon-option-vertical pull-right">
                                </i></a>
                                </li>


                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 ">
                    <div className="col-md-2 pad">
                        <div className="estimationuser tooltip"><span>C</span>
                            <p className="tooltiptext">{estimation.client ? estimation.client.name : ''}</p>
                        </div>
                        <div className="estimationuser"><span>E</span></div>
                        <div className="estimationuser"><span>N</span></div>
                    </div>
                    <div className="col-md-3">
                        <div className="logo">
                            <img src="/images/react.png"/>
                            <img src="/images/mongodb.png"/>
                            <img src="/images/node.png"/>

                        </div>
                    </div>

                    <div className="col-md-5">
                        {(estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status) ||
                            estimation.loggedInUserRole == SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
                        && <form>
                            <button type="button" className="btn taskbtn"
                                    onClick={() => this.props.showAddTaskForm(estimation)}><i
                                className="fa fa-plus-circle"></i>
                                Add task
                            </button>
                            <button type="button" className="btn featurebtn"
                                    onClick={() => this.props.showAddFeatureForm(estimation)}
                            ><i className="fa fa-plus-circle"></i>
                                Add feature
                            </button>
                        </form>}
                    </div>

                    <div className="col-md-2 text-right esTime">
                        <b>{estimation.estimatedHours}</b>
                        <div className="clock">
                            <i className="fa fa-clock-o "></i>
                        </div>
                    </div>
                </div>

                <div className=" col-md-12">
                    <div className="col-md-6"><span className="customBtn">{estimation.status}</span></div>
                </div>
                <div className="col-md-12">
                    <EstimationFeaturesContainer estimationStatus={estimation.status}
                                                 editView={editView}
                                                 loggedInUserRole={estimation.loggedInUserRole}/>
                </div>
                <br/>
                <div className="col-md-12">
                    <EstimationTasksContainer estimationStatus={estimation.status}
                                              editView={editView}
                                              loggedInUserRole={estimation.loggedInUserRole}/>
                </div>
                {(estimation.status == SC.STATUS_APPROVED) && (estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR) &&
                <div className="col-md-12">
                    <button type="button" className="btn customBtn" onClick={
                        () => {
                            this.props.showProjectAwardForm(estimation)
                        }}>Project Award
                    </button>
                </div>}
            </div>
            <div className="col-md-4 estimationsection pad">
                <RepositorySearchContainer editView={editView}/>
            </div>
        </div>
    }

}

export default EstimationDetail
