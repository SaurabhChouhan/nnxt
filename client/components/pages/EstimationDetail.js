import React, {Component} from 'react'
import * as SC from '../../../server/serverconstants'
import {ConfirmationDialog} from "../"
import {EstimationFeaturesContainer, EstimationTasksContainer} from "../../containers"
import * as logger from '../../clientLogger'
import {WithContext as ReactTags} from 'react-tag-input';

class EstimationDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showEstimationRequestDialog: false,
            type: ['All', 'Feature', 'Task'],
            tags: [],
            suggestions: this.props.estimation.technologies
        };
        this.props.estimation.technologies.map((f, i) => {
            this.state.tags.push({
                id: this.state.tags.length + 1,
                text: f
            });
        })
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }

    handleDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});
    }

    handleAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState({tags: tags});
    }

    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({tags: tags});
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
        const {tags, suggestions} = this.state;
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

            </div>
            <div className="col-md-4 estimationsection pad">
                <div className="col-md-12 repositoryHeading">
                    <div className="col-md-10">
                        <div className="dropdownoption">
                            <select className="form-control"
                                    onChange={e => this.props.onChangeTypeSearch(e.target.value)}>
                                {
                                    this.state.type.map((item, key) =>
                                        <option value={item} key={key}>{item}</option>
                                    )
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-1 pad marginTop">
                        <div className="backarrow">
                            <h5><a href=""><img key="he_requested_delete" src="/images/go_button.png"
                                                onClick={() => {
                                                }}/></a></h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 ">
                    <ReactTags
                        classNames=
                            {{
                                tags: 'tagsClass',
                                tagInput: 'tagInputClass',
                                tagInputField: 'tagInputFieldClass',
                                selected: 'selectedClass',
                                tag: 'tagClass technologytagNew',
                                remove: 'removeClass',
                                suggestions: 'suggestionsClass',
                                activeSuggestion: 'activeSuggestionClass'
                            }}
                        tags={tags}
                        suggestions={suggestions}
                        placeholder="Repository"
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}/>
                </div>

                <div className="col-md-12">

                    {
                        Array.isArray(this.props.repository) && this.props.repository.map((f, i) =>
                            (f.isFeature) ?
                                [<div className="repository repositoryFeature">
                                    <div className="RepositoryHeading" key={i}>
                                        <div>
                                            <div className="repositoryFeatureLable"></div>
                                            <h5>Feature</h5><i
                                            className="glyphicon glyphicon-option-vertical pull-right"></i><span
                                            className="pull-right">(04 HRS)</span></div>
                                    </div>
                                    <div className="RepositoryContent">
                                        <p>{f.description}</p>
                                    </div>
                                </div>]
                                :
                                [<div className="repository repositoryTask">
                                    <div className="RepositoryHeading" key={i}>
                                        <div>
                                            <div className="repositoryTaskLable"></div>
                                            <h5>Task</h5><i
                                            className="glyphicon glyphicon-option-vertical pull-right"></i><span
                                            className="pull-right">(04 HRS)</span></div>
                                    </div>
                                    <div className="RepositoryContent">
                                        <p>{f.description}</p>
                                    </div>
                                </div>]
                        )
                    }
                </div>
            </div>
        </div>
    }

}

export default EstimationDetail