import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import Dialog from 'react-bootstrap-dialog'
import {ConfirmationDialog} from "../"
import {EstimationTaskContainer} from "../../containers"
import * as logger from '../../clientLogger'

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

        const {estimation,features} = this.props
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
                    <div className="col-md-3">
                        {
                            this.props.loggedInUser.roleNames.includes(SC.ROLE_ESTIMATOR) &&
                            <button className="btn customBtn"
                                    onClick={() => this.props.showAddTaskForm(estimation)}>Add Task
                            </button>
                        }
                        {
                            this.props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                            <button className="btn customBtn"
                                    onClick={() => this.setState({showEstimationRequestDialog: true})}>Request
                                Estimation
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
                {features && Array.isArray(features) && features.length > 0 ?
                    features.map((feature,idx)=> {
                   return  <div className="col-md-12">
                            <div className="feature">
                                <div className="col-md-12 pad">
                                    <h4>{feature.estimator.name}</h4>
                                </div>
                                <div className="col-md-12 pad">
                                    <p>{feature.estimator.description}</p>
                                </div>
                                <div className="col-md-2 col-md-offset-1 pad">
                                    <h4>Est. Hrs:</h4> <h4>&nbsp;8</h4>
                                </div>
                                <div className="col-md-3 pad">
                                    <h4>Sug. Hrs:</h4> <h4>&nbsp;6</h4>
                                </div>
                                <div className="col-md-6 text-right estimationActions pad">
                                    <img src="/images/edit.png" onClick={()=>this.props.showEditFeatureForm(feature)}></img>
                                    <img src="/images/delete.png"></img>
                                    <img src="/images/move_outof_feature.png"></img>
                                </div>
                                <div className="newFlagStrip">
                                    <img src="/images/new_flag.png"></img>
                                </div>
                                <div className="repoFlagStrip">
                                    <img src="/images/repo_flag.png"></img>
                                </div>
                            </div>
                        </div>})
                     : <label>No feature Added! </label>}
                <br/>
                <div className="col-md-12">
                    <EstimationTaskContainer onTaskDelete={this.props.onTaskDelete}/>
                </div>
                <div className=" col-md-12 estimationfooter">
                    <div className="col-md-4"><span className="customBtn">Estimation Completed</span></div>
                    <div className="col-md-8">
                        <form>
                            <button type="button" className="btn taskbtn"><i className="fa fa-plus-circle"></i>
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
            </div>
            <div className="col-md-4 estimationsection">
                <div className="col-md-12">

                    <div className="col-md-5 repositoryheading">
                        <h5><b>Repository</b></h5>
                    </div>
                    <div className="col-md-3 ">
                        <div className="search">
                            <a href=""><i className="glyphicon glyphicon-search"></i></a>
                        </div>
                    </div>
                    <div className="col-md-4 dropdownoption">
                        <select className="form-control select">
                            <option value="">All</option>
                            <option value="">project1</option>
                            <option value="">project2</option>
                            <option value="">project3</option>
                        </select>
                    </div>
                </div>
                <div className="col-md-12 repoSections">
                    <h5 className="featuretask"><b> Task name 02 Hrs </b></h5>
                    <p>This will contain task detail</p>
                    <button type="button" className="btn btn-link">Read More...</button>
                </div>
                <div className="col-md-12 repoSections">
                    <h5><b>Feature name 02 Hrs</b></h5>
                    <p>This will contain features detail</p>
                    <button type="button" className="btn btn-link">Read More...</button>
                </div>
                <div className="col-md-12 repoSections"><h5><b>Feature name 02 Hrs </b></h5>
                    <p>This will contain features detail</p>
                    <button type="button" className="btn btn-link">Read More...</button>
                </div>
                <div className="col-md-12 repoSections"><h5 className="featuretask"><b>Task name 02 Hrs </b></h5>
                    <p>This will contain task detail</p>
                    <button type="button" className="btn btn-link">Read More...</button>
                </div>
            </div>
        </div>
    }

}

export default EstimationDetail