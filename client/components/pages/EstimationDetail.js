import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import Dialog from 'react-bootstrap-dialog'
import {ConfirmationDialog} from "../"
import {EstimationTasksContainer, EstimationFeaturesContainer} from "../../containers"
import * as logger from '../../clientLogger'

class EstimationDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            showEstimationRequestDialog: false
        }
    }

    onClose() {
        this.setState({showEstimationRequestDialog: false, showEstimationReviewDialog: false})
    }

    onConfirmEstimationRequest() {
        this.setState({showEstimationRequestDialog: false})
        this.props.sendEstimationRequest(this.props.estimation)
    }

    onConfirmReviewRequest() {
        this.setState({showEstimationReviewDialog: false})
        this.props.sendReviewRequest(this.props.estimation)
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
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 ">
                    <div className="col-md-3 pad">
                        <div className="estimationuser tooltip"><span>C</span>
                            <p className="tooltiptext">{estimation.client ? estimation.client.name : ''}</p>
                        </div>
                        <div className="estimationuser"><span>E</span></div>
                        <div className="estimationuser"><span>N</span></div>
                    </div>
                    <div className="col-md-6">
                        <div className="logo">
                            <img src="/images/react.png"/>
                            <img src="/images/mongodb.png"/>
                            <img src="/images/node.png"/>
                            <img src="/images/html.png"/>
                            <img src="/images/java.png"/>
                        </div>
                    </div>
                    <div className="col-md-3 text-right esTime">
                        <b>8 Hrs</b>
                        <div className="clock">
                            <i className="fa fa-clock-o "></i>
                        </div>
                    </div>
                </div>
                <div className=" col-md-12">
                    <div className="col-md-6"><span className="customBtn">{estimation.status}</span></div>
                    <div className="col-md-6">
                        <form>
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
                        </form>
                    </div>
                </div>
                <div className="col-md-12">
                    <EstimationFeaturesContainer/>
                </div>
                <br/>
                <div className="col-md-12">
                    <EstimationTasksContainer/>
                </div>

            </div>
            <div className="col-md-4 estimationsection pad">


                <div className="col-md-12 repositoryHeading">
                    <div className="col-md-10 pad">
                        <h4>Repository</h4>
                    </div>
                    <div className="col-md-2 pad text-right">
                        <div className="search">
                            <a href=""><i className="glyphicon glyphicon-search"></i></a>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="dropdownoption">
                        <select   className="form-control ">
                            <option value="">Technology</option>
                            <option value="">project1</option>
                            <option value="">project2</option>
                            <option value="">project3</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="dropdownoption">
                        <select   className="form-control ">
                            <option value="">All</option>
                            <option value="">project1</option>
                            <option value="">project2</option>
                            <option value="">project3</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="technologytag">
                        <span>android</span>
                        <button type="button" className="btn "> <i className="glyphicon glyphicon-remove"></i>
                        </button>
                    </div>
                    <div className="technologytag">
                        <span>iOS</span>
                        <button type="button" className="btn "> <i className="glyphicon glyphicon-remove"></i>
                        </button>
                    </div>
                    <div className="technologytag">
                        <span>Java</span>
                        <button type="button" className="btn "> <i className="glyphicon glyphicon-remove"></i>
                        </button>
                    </div>
                </div>
                <div className="col-md-12">
                    <div className="repository repositoryFeature">
                        <div className="RepositoryHeading">
                            <div className="repositoryFeatureLable">
                            </div>
                            <h5>Feature</h5><i className="glyphicon glyphicon-option-vertical pull-right"></i><span className="pull-right">(04 HRS)</span>
                        </div>
                        <div className="RepositoryContent">
                            <p>Lorem ipsum dolor sit amet consetutor</p>
                        </div>
                    </div>
                    <div className="repository repositoryTask">
                        <div className="RepositoryHeading">
                            <div className="repositoryTaskLable">
                            </div>
                            <h5>Task</h5><i className="glyphicon glyphicon-option-vertical pull-right"></i><span className="pull-right">(04 HRS)</span>
                        </div>
                        <div className="RepositoryContent">
                            <p>Lorem ipsum dolor sit amet consetutor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

}

export default EstimationDetail