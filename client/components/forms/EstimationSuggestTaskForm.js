import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {number, required} from './validation'
import {renderMultiselect, renderSelect, renderText, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from "react-redux";
import * as SC from "../../../server/serverconstants"

let EstimationSuggestTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {estimation, loggedInUserRole, pristine, submitting} = props
    let isLeftDisable = true, isRightDisable = false;
    return <form onSubmit={props.handleSubmit}>
        <div className="col-md-6">
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
                           label={"Estimated Hours:"}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Field name="readOnly.description"
                           readOnly={true}
                           component={renderTextArea}
                           rows="10"
                           label="Description:"
                    />
                </div>

            </div>

        </div>
        <div className="col-md-6">
            <div className="row">

                <div className="col-md-6">
                    <Field
                        name="name"
                        component={renderText}
                        label={"Name:"}
                        validate={loggedInUserRole == SC.ROLE_ESTIMATOR ? [required] : []}
                    />
                </div>
                <div className="col-md-6">
                    <Field
                        name="estimatedHours"
                        component={renderText}
                        label={"Estimated Hours:"}
                        validate={loggedInUserRole == SC.ROLE_ESTIMATOR ? [required, number] : [number]}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Field
                        name="description"
                        component={renderTextArea}
                        label="Description:"
                        rows="10"
                        validate={loggedInUserRole == SC.ROLE_ESTIMATOR ? [required] : []}
                    />
                </div>

            </div>
        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Save</button>
            </div>
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Reset</button>
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
        const loggedInUserRole = selector(state, 'loggedInUserRole')
        return {
            loggedInUserRole
        }
    }
)(EstimationSuggestTaskForm)


export default EstimationSuggestTaskForm