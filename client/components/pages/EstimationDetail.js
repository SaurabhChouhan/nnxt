import React, {Component} from 'react'
import * as SC from '../../../server/serverconstants'
import {ConfirmationDialog} from "../"
import {NewConfirmationDialog} from "../dialogs/ConfirmationDialog";
import {EstimationFeaturesContainer, EstimationTasksContainer, RepositorySearchContainer} from "../../containers"
import * as logger from '../../clientLogger'
import _ from 'lodash'


class EstimationDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEstimationRequestDialog: false,
            showEstimationApproveDialog: false,
            showEstimationDeleteDialog: false
        };
    }

    onClose() {
        this.setState({
            showEstimationRequestDialog: false,
            showEstimationReviewDialog: false,
            showEstimationChangeDialog: false,
            showEstimationApproveDialog: false,
            showEstimationReopenDialog: false,
            showEstimationDeleteDialog: false
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

    onConfirmDelete() {
        this.setState({showEstimationDeleteDialog: false})
        this.props.deleteEstimation(this.props.estimation).then(json => {
            if (json.success) {
                this.props.history.push("/app-home/estimation")
                this.props.estimationGoBack()
            }
        })
    }


    render() {
        logger.debug(logger.ESTIMATION_DETAIL_RENDER, this.props)
        const {estimation, userRoleInThisEstimation} = this.props;
        let editView = false
        if ((userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status)) || (userRoleInThisEstimation === SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))) {
            editView = true
        }

        return <div>
            <div className="col-md-8 pad estimation-container">
                <div className="col-md-12 estimateheader">
                    {estimation.canApprove && userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && estimation.status === SC.STATUS_REVIEW_REQUESTED ?
                        <div className="col-md-7 pad">

                            <div title="Go Back" className=" col-md-7 backarrow estimationBackArrow">
                                <div className="col-md-1 pad">
                                    <button className="btn-link pad backBtnMarginTop" onClick={() => {
                                        this.props.history.push("/app-home/estimation")
                                        this.props.estimationGoBack()
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                                </div>
                                <div className="col-md-11 ">
                                    <h5>
                                        <b>{estimation.project ? estimation.project.name : ''}</b>
                                    </h5>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <button className="btn approveBtn"
                                        onClick={() => this.setState({showEstimationApproveDialog: true})}>Approve
                                    Estimation
                                </button>
                            </div>
                        </div>
                        : <div className="col-md-7 pad">

                            <div title="Go Back" className="col-md-7  backarrow estimationBackArrow">
                                <div className="col-md-1 pad">
                                    <button className="btn-link pad backBtnMarginTop" onClick={() => {
                                        this.props.history.push("/app-home/estimation")
                                        this.props.estimationGoBack()
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                                </div>
                                <div className="col-md-11">
                                    <h5>
                                        <b>{estimation.project ? estimation.project.name : ''}</b>
                                    </h5>
                                </div>
                            </div>
                            {
                                (_.includes([SC.STATUS_INITIATED], estimation.status) && userRoleInThisEstimation === SC.ROLE_NEGOTIATOR) &&
                                <button type="button" className="btn customBtn" onClick={() => {
                                    this.props.editEstimationInitiateForm(estimation)
                                }
                                }>Edit Estimation</button>

                            }
                        </div>


                    }
                    {
                        this.state.showEstimationRequestDialog &&
                        <NewConfirmationDialog show={true} onConfirm={this.onConfirmEstimationRequest.bind(this)}
                                               title="Estimation Request" onClose={this.onClose.bind(this)}
                        >
                            <div>This will send an 'Estimation Request' to
                                <span className={"highlightText"}> {this.props.estimation.estimator.firstName}</span> so
                                that appropriate estimates can be added.
                                You will be unable to edit it until <span
                                    className={"highlightText"}> {this.props.estimation.estimator.firstName}</span> sends
                                estimation back for your review. Please confirm.
                            </div>
                        </NewConfirmationDialog>
                    }
                    {
                        this.state.showEstimationApproveDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmEstimationApprove.bind(this)}
                                            title="Estimation Approve" onClose={this.onClose.bind(this)}
                                            body={`Approving estimation means that you are satisfied with this estimation and now locking it. Neither you nor ${this.props.estimation.estimator.firstName} would be able to change anything in estimation. You can re-open estimation anytime to start modifying it again. Please confirm!`}/>
                    }

                    {
                        this.state.showEstimationChangeDialog &&
                        <NewConfirmationDialog show={true} onConfirm={this.onConfirmChangeRequest.bind(this)}
                                               title="Change Request" onClose={this.onClose.bind(this)}>
                            <div>This will send a 'Change Request' to
                                <span className={"highlightText"}> {this.props.estimation.estimator.firstName}</span> so
                                that appropriate changes can be made to estimation as per your suggestions.
                                You will be unable to edit it until <span
                                    className={"highlightText"}> {this.props.estimation.estimator.firstName}</span> sends
                                estimation back for your review. Please confirm.
                            </div>
                        </NewConfirmationDialog>

                    }

                    {
                        this.state.showEstimationReviewDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmReviewRequest.bind(this)}
                                            title="Estimation Request" onClose={this.onClose.bind(this)}
                                            dialogName={SC.DIALOG_ESTIMATION_REQUEST_REVIEW}
                                            hasError={this.props.estimation.hasError}
                                            body={this.props.estimation && this.props.estimation.hasError ?
                                                `There are still few tasks/features that have estimated hours missing. This would prevent ${this.props.estimation.negotiator.firstName} from approving them during review and hence estimation would need to be send back to you needing extra iteration for completion. Press 'Cancel' to add missing information or press Confirm to send Estimation for review` :
                                                `You are about to send 'Review Request' to ${this.props.estimation.negotiator.firstName}. Please note , any estimates given by you would be considered final and ${this.props.estimation.negotiator.firstName} would be able to approve them without needing further changes from you. Please confirm!`
                                            }
                        />
                    }
                    {
                        this.state.showEstimationReopenDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmReopen.bind(this)}
                                            title="Estimation Reopen" onClose={this.onClose.bind(this)}
                                            body="Reopening an estimation means you would like to make changes to this estimation. Please confirm!"/>
                    }
                    {
                        this.state.showEstimationDeleteDialog &&
                        <ConfirmationDialog show={true} onConfirm={this.onConfirmDelete.bind(this)}
                                            dialogName={SC.DIALOG_ESTIMATION_REQUEST_REVIEW}
                                            title="Estimation Delete" onClose={this.onClose.bind(this)}
                                            hasError={true}
                                            body="Deleting this estimation would remove it from database. This operation cannot be reversed. Please confirm!!!"/>
                    }


                    <div className="col-md-3 pad">
                        {
                            userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && estimation.status === SC.STATUS_INITIATED &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationRequestDialog: true})}>Request
                                Estimation
                            </button>
                        }
                        {

                            userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && estimation.status === SC.STATUS_APPROVED &&
                            <button className="btn reopenBtn"
                                    onClick={() => this.setState({showEstimationReopenDialog: true})}>Reopen Estimation
                            </button>
                        }
                        {
                            userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && estimation.status === SC.STATUS_REVIEW_REQUESTED &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationChangeDialog: true})}>
                                Request Change
                            </button>
                        }

                        {
                            userRoleInThisEstimation === SC.ROLE_ESTIMATOR && (estimation.status === SC.STATUS_ESTIMATION_REQUESTED || estimation.status === SC.STATUS_CHANGE_REQUESTED) &&
                            <button className="btn customBtn"
                                    onClick={() => {

                                        this.props.hasErrorInEstimation(this.props.estimation)
                                        this.setState({showEstimationReviewDialog: true})
                                    }
                                    }>
                                Request Review
                            </button>
                        }

                    </div>
                    <div className="col-md-1 pad">
                        {
                            userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && (estimation.status === SC.STATUS_INITIATED || estimation.status === SC.STATUS_REVIEW_REQUESTED) &&
                            < button type="button" className="btn customBtn deleteEstimationBtn" onClick={() => {
                                this.setState({showEstimationDeleteDialog: true})

                            }
                            }><i className="fa fa-trash iconClr "></i></button>
                        }

                    </div>

                    <div className="col-md-1 pad ">
                        <div className="estimationfileoption">
                            <ul className="list-unstyled">
                                {editView &&
                                < button type="button" className="btn customBtn filterAlign" onClick={() => {
                                    this.props.estimationFilterForm()
                                }
                                }>filter</button>
                                }

                                {/*
                                    <li><a href=""> <i className="fa fa-file-pdf-o"></i></a></li>
                                    < li > < a href=""> <i className="fa fa-file-word-o"></i></a></li>
                                    <li><a href=""> <i className=" fa fa-file-excel-o"></i></a></li>
                                    <li><a href=""> <i className="glyphicon glyphicon-option-vertical pull-right">
                                    </i></a>
                                    </li>
                                */}


                            </ul>
                        </div>
                    </div>
                </div>

                < div
                    className="col-md-12 ">
                    < div
                        className="col-md-2 pad">
                        < div
                            className="estimationuser tooltip"><span> C </span>
                            <p className="tooltiptext">{estimation.client ? estimation.client.name : ''}</p>
                        </div>
                        <div className="estimationuser tooltip"><span>N</span>
                            <p className="tooltiptext">{estimation.negotiator ? estimation.negotiator.firstName : ''}</p>
                        </div>
                        < div
                            className="estimationuser tooltip"><span> E </span>
                            <p className="tooltiptext">{estimation.estimator ? estimation.estimator.firstName : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="logo">

                            {
                                estimation.technologies.map(t =>
                                    <img src={"/images/technology/" + t.name.replace(' ', '_') + ".png"}/>
                                )
                            }

                            {/*
                            <img src="/images/react.png"/>
                            <img src="/images/mongodb.png"/>
                              <img src="/images/node.png"/>
                             */}

                        </div>
                    </div>

                    <div className="col-md-5">
                        {(userRoleInThisEstimation === SC.ROLE_NEGOTIATOR && _.includes([SC.STATUS_INITIATED, SC.STATUS_REVIEW_REQUESTED], estimation.status) ||
                            userRoleInThisEstimation === SC.ROLE_ESTIMATOR && _.includes([SC.STATUS_ESTIMATION_REQUESTED, SC.STATUS_CHANGE_REQUESTED], estimation.status))
                        && <form>
                            <button type="button" className="btn taskbtn"
                                    onClick={() => this.props.showAddTaskForm(estimation)}><i
                                className="fa fa-plus-circle"></i>
                                Add Task
                            </button>
                            <button type="button" className="btn featurebtn"
                                    onClick={() => this.props.showAddFeatureForm(estimation)}
                            ><i className="fa fa-plus-circle"></i>
                                Add Feature
                            </button>
                        </form>}
                    </div>
                    <div className="col-md-3">
                        <div className="col-md-6  esTime">
                            <b>{estimation.estimatedHours + " Hrs"}</b>
                            <div className="clock">
                                <i className="fa fa-clock-o " title="estimated Hours"></i>
                            </div>

                        </div>
                        <div className="col-md-6  esTime">
                            <b>{estimation.suggestedHours + " Hrs"}</b>
                            <div className="suggestedclock">
                                <i className="fa fa-clock-o " title="Suggeted Hours"></i>
                            </div>

                        </div>
                    </div>


                </div>

                <div className=" col-md-12">
                    <div className="col-md-10"><span className="customBtn">{estimation.status}</span></div>
                    <div className="col-md-1">
                        <button style={{float: 'right'}} type="button" className="btn excelBtn" onClick={
                            ()=>{this.props.exportEstimation(estimation._id)}
                        }>
                            <i className="fa fa-file-excel-o"></i></button>
                    </div>
                    <div className="col-md-1">
                        <button style={{float: 'right'}} type="button" className="btn customBtn" onClick={
                            () => {
                                this.props.refreshEstimation(estimation)
                            }}><i className="fa fa-refresh"></i></button>
                    </div>
                </div>
                <div className="col-md-12">
                    <EstimationFeaturesContainer estimationStatus={estimation.status}
                                                 editView={editView}
                                                 loggedInUserRole={userRoleInThisEstimation}/>
                </div>
                <br/>
                <div className="col-md-12">
                    <EstimationTasksContainer estimationStatus={estimation.status}
                                              editView={editView}
                                              loggedInUserRole={userRoleInThisEstimation}/>
                </div>
                {(estimation.status === SC.STATUS_APPROVED) && (userRoleInThisEstimation === SC.ROLE_NEGOTIATOR) &&
                <div className="col-md-12">
                    <button type="button" className="btn customBtn" onClick={
                        () => {
                            this.props.showProjectAwardForm(estimation)
                        }}>Create Release
                    </button>
                    <button type="button" className="btn customBtn" onClick={
                        () => {
                            this.props.showAddToReleaseForm(estimation)
                        }}>Add to Release
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
