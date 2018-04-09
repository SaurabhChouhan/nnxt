import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {number, required} from './validation'
import {renderText, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from "react-redux";
import * as SC from "../../../server/serverconstants"

let EstimationSuggestTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {pristine, submitting, reset, change} = props
    const {loggedInUserRole, isFromRepo, estimation, readOnly} = props
    console.log("EstimationSuggestTaskForm isFromRepo-", isFromRepo)
    return <form onSubmit={props.handleSubmit}>
        <div className="col-md-12">
            <div className="col-md-5">
                <div className="col-md-1">
                    {estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR ?
                        <img key="estimator" className="suggestionUser div-hover" src="/images/estimator.png"
                             title="Estimator End"/> :
                        estimation.loggedInUserRole == SC.ROLE_ESTIMATOR ?
                            <img key="negotiator" className="suggestionUser div-hover" src="/images/negotiator.png"
                                 title="Negotiator End"/> : null
                    }
                </div>
                <div className="col-md-11">
                    <div className="row">

                        <Field name="estimation._id" component="input" type="hidden"/>
                        <Field name="_id" component="input" type="hidden"/>

                        <div className="col-md-6">
                            <Field name="readOnly.name"
                                   readOnly={true}
                                   component={renderText}
                                   label={"Task Name:"}
                            />
                        </div>
                        <div className="col-md-6">
                            <Field name="readOnly.estimatedHours"
                                   component={renderText}
                                   readOnly={true}
                                   label={"Task Estimated Hours:"}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Field name="readOnly.description"
                                   readOnly={true}
                                   component={renderTextArea}
                                   rows="10"
                                   label="Task Description:"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-2 ">
                <button type="button" className="suggestCopy btn-link"
                        title="Copy Task Details"
                        onClick={() => {
                            change("name", readOnly.name)
                            change("estimatedHours", readOnly.estimatedHours)
                            change("description", readOnly.description)
                        }}><i className="glyphicon glyphicon-arrow-right"></i></button>
            </div>
            <div className="col-md-5">
                <div className="col-md-1">
                    {estimation.loggedInUserRole == SC.ROLE_ESTIMATOR ?
                        <img key="estimator" className="suggestionUser div-hover" src="/images/estimator.png"
                             title="Estimator End"/> :
                        estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR ?
                            <img key="negotiator" className="suggestionUser div-hover" src="/images/negotiator.png"
                                 title="Negotiator End"/> : null
                    }
                </div>
                <div className="col-md-11">
                    <div className="row">

                        <div className="col-md-6">
                            <Field
                                name="name"
                                readOnly={isFromRepo}
                                component={renderText}
                                label={"Task Name:"}
                                validate={required}
                            />
                        </div>
                        <div className="col-md-6">
                            <Field
                                name="estimatedHours"
                                component={renderText}
                                label={"Task Estimated Hours:"}
                                validate={[required, number]}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <Field
                                name="description"
                                readOnly={isFromRepo}
                                component={renderTextArea}
                                label="Task Description:"
                                rows="10"
                                validate={required}
                            />
                        </div>

                    </div>
                </div>
            </div>
            <div className="row initiatEstimation">
                <div className="col-md-6 text-center">
                    <button type="submit" disabled={pristine || submitting} className="btn customBtn">Save</button>
                </div>
                <div className="col-md-6 text-center">
                    <button type="button" disabled={pristine || submitting} className="btn customBtn" onClick={reset}>
                        Reset
                    </button>
                </div>
            </div>
        </div>
    </form>
}

EstimationSuggestTaskForm = reduxForm({
    form: 'estimation-suggest-task'
})(EstimationSuggestTaskForm)

const selector = formValueSelector('estimation-suggest-task')

EstimationSuggestTaskForm = connect(
    state => {
        const {loggedInUserRole, isFromRepo} = selector(state, 'loggedInUserRole', 'isFromRepo')
        const readOnly = {
            name: selector(state, 'readOnly.name'),
            estimatedHours: selector(state, 'readOnly.estimatedHours'),
            description: selector(state, 'readOnly.description')
        }
        return {
            loggedInUserRole,
            readOnly,
            isFromRepo
        }
    }
)(EstimationSuggestTaskForm)


export default EstimationSuggestTaskForm