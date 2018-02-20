import React, {Component} from 'react'
import * as SC from '../../../server/serverconstants'
import {ConfirmationDialog} from "../"
import {EstimationFeaturesContainer, EstimationTasksContainer, RepositorySearchContainer} from "../../containers"
import * as logger from '../../clientLogger'
import * as A from "../../actions";
import * as COC from "../componentConsts";
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
class EstimationDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEstimationRequestDialog: false
        };
    }
    onClose() {
        this.setState({
            showEstimationRequestDialog: false,
            showEstimationReviewDialog: false,
            showEstimationChangeDialog: false
        })
    }

    onConfirmEstimationRequest() {
        this.setState({showEstimationRequestDialog: false})
        this.props.sendEstimationRequest(this.props.estimation)
    }

    onConfirmReviewRequest() {
        this.setState({showEstimationReviewDialog: false})
        this.props.sendReviewRequest(this.props.estimation)
    }

    onConfirmReviewRequest() {
        this.setState({showEstimationReviewDialog: false})
        this.props.sendReviewRequest(this.props.estimation)
    }

    onConfirmChangeRequest() {
        this.setState({showEstimationChangeDialog: false})
        this.props.sendChangeRequest(this.props.estimation)
    }

    formatName(estimatorSecion) {
        if (estimatorSecion)
            return estimatorSecion.name
        return ''
    }

    formatDescription(estimatorSecion) {
        if (estimatorSecion)
            return estimatorSecion.description
        return ''
    }


    render() {

        logger.debug(logger.ESTIMATION_DETAIL_RENDER, this.props)
        const {estimation} = this.props
        return <div>
            <div className="col-md-8 pad">
                <div className="col-md-12 estimateheader">
                    <div className="col-md-5 pad">
                        <div className="backarrow">
                            <h5>
                                <a href=""><i
                                    className="glyphicon glyphicon-arrow-left"></i></a><b>{estimation.project ? estimation.project.name : ''}</b>
                            </h5>
                        </div>
                    </div>
                    {
                        this.state.showEstimationRequestDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmEstimationRequest.bind(this)}
                                            title="Estimation Request" onClose={this.onClose.bind(this)}
                                            body="You are about to send 'Estimation Request' to Estimator of this Estimation. Please confirm!"/>
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


                    <div className="col-md-3">
                        {
                            estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR && estimation.status == SC.STATUS_INITIATED &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationRequestDialog: true})}>Request
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
                    <div className="col-md-4 pad">
                        <div className="estimationfileoption">
                            <ul className="list-unstyled">
                                <li><a href=""> <i className="fa fa-file-pdf-o"></i></a></li>
                                <li><a href=""> <i className="fa fa-file-word-o"></i></a></li>
                                <li><a href=""> <i className=" fa fa-file-excel-o"></i></a></li>
                                <li><a href=""> <i class="glyphicon glyphicon-option-vertical pull-right">

                                    <Link to="/app-home/estimation-detail" onClick={() => {
                                        this.props.dispatch(A.showComponent(COC.ESTIMATION_FILTER_DIALOG))
                                    }}>filter</Link>
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
                        <b>8 Hrs</b>
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
                                                 loggedInUserRole={estimation.loggedInUserRole}/>
                </div>
                <br/>
                <div className="col-md-12">
                    <EstimationTasksContainer estimationStatus={estimation.status}
                                              loggedInUserRole={estimation.loggedInUserRole}/>
                </div>
                {(estimation.status == SC.STATUS_APPROVED) && (estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR) && <div className="col-md-12">
                    <button type="button" className="btn customBtn" onClick={
                        () => {
                            this.props.showProjectAwardForm(estimation)
                        }}>Project Award
                    </button>
                </div>}
            </div>
            <div className="col-md-4 estimationsection pad">
                <RepositorySearchContainer  {...this.props}/>
            </div>
        </div>
    }

}

export default connect()(EstimationDetail)