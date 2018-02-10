import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {number, required} from './validation'
import {renderMultiselect, renderSelect, renderText, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from "react-redux";
import * as SC from "../../../server/serverconstants"

let EstimationTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {estimation, loggedInUserRole} = props
    let isLeftDisable = true, isRightDisable = false;
    return <form onSubmit={props.handleSubmit}>
        <div className="col-md-6">
            <div className="row">

                <Field name="estimation._id" component="input" type="hidden"/>
                <Field name="_id" component="input" type="hidden"/>

                <div className="col-md-6">
                    <Field name="readOnly.name"
                           readOnly={isLeftDisable}
                           component={renderText}
                           label={"Task Name:"}
                           validate={isLeftDisable?null:[required]}/>
                </div>
                <div className="col-md-6">
                    <Field name="readOnly.estimatedHours"
                           component={renderText}
                           readOnly={isLeftDisable}
                           label={"Estimated Hours:"}
                           validate={isLeftDisable?null:[required, number]}/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Field name="readOnly.description"
                           readOnly={isLeftDisable}
                           component={renderTextArea}
                           rows="10"
                           label="Task Description:"
                           validate={isLeftDisable?null:[required]}/>
                </div>

            </div>

        </div>
        <div className="col-md-6">
            <div className="row">

                <div className="col-md-6">
                    <Field
                        name="name"
                        readOnly={isRightDisable}
                        component={renderText}
                        label={"Suggest Name:"}
                        validate={isRightDisable?null:[required]}
                    />
                </div>
                <div className="col-md-6">
                    <Field
                        name="estimatedHours"
                        component={renderText}
                        label={"Estimated Hours:"}
                        validate={isRightDisable?null:[required, number]}
                        readOnly={isRightDisable}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Field
                        name="description"
                        component={renderTextArea}
                        label="Suggest Description:"
                        rows="10"
                        validate={isRightDisable?null:[required]}
                        readOnly={isRightDisable}
                    />
                </div>

            </div>
        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" className="btn customBtn">{loggedInUserRole == SC.ROLE_NEGOTIATOR ? "Suggest" : "Update"}</button>
            </div>
            <div className="col-md-6 text-center">
                <button type="submit" className="btn customBtn">Reset</button>
            </div>
        </div>
    </form>
}

EstimationTaskForm = reduxForm({
    form: 'estimation-suggest-task'
})(EstimationTaskForm)

const selector = formValueSelector('estimation-suggest-task')

EstimationTaskForm = connect(
    state => {
        const loggedInUserRole = selector(state, 'loggedInUserRole')
        return {
            loggedInUserRole
        }
    }
)(EstimationTaskForm)


export default EstimationTaskForm