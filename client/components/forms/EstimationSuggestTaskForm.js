import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {number, required} from './validation'
import {renderMultiselect, renderSelect, renderText, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from "react-redux";

let EstimationTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {estimation, _id} = props
    let isLeftDisable = true, isRightDisable = false;
    return <form onSubmit={props.handleSubmit}>
        <div className="col-md-6">
            <div className="row">

                <Field name="estimation._id" component="input" type="hidden"/>
                <Field name="_id" component="input" type="hidden"/>

                <div className="col-md-6">
                    <Field name="task.name"
                           readOnly={isLeftDisable}
                           component={renderText}
                           label={"Task Name:"}
                           validate={isLeftDisable?null:[required]}/>
                </div>
                <div className="col-md-6">
                    <Field name="task.estimatedHours"
                           component={renderText}
                           readOnly={isLeftDisable}
                           label={"Estimated Hours:"}
                           validate={isLeftDisable?null:[required, number]}/>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <Field name="task.description"
                           readOnly={isLeftDisable}
                           component={renderTextArea}
                           label="Task Description:"
                           validate={isLeftDisable?null:[required]}/>
                </div>

            </div>
            <div className="row">
                <div className="col-md-6">
                    <Field name="task.feature_id"
                           disabled={isLeftDisable}
                           component={renderSelect}
                           label={"Feature:"}
                           options={props.features}
                           displayField={"estimator.name"}/>
                </div>
                <div className="col-md-6">
                    <Field name="task.technologies"
                           disabled={isLeftDisable}
                           component={renderMultiselect}
                           label="technologies:"
                           data={estimation.technologies}/>
                </div>
            </div>
        </div>
        <div className="col-md-6">
            <div className="row">

                <Field name="suggest.estimation._id" component="input" type="hidden"/>
                <Field name="_id" component="input" type="hidden"/>

                <div className="col-md-6">
                    <Field
                        name="suggest.name"
                        readOnly={isRightDisable}
                        component={renderText}
                        label={"Suggest Name:"}
                        validate={isRightDisable?null:[required]}
                    />
                </div>
                <div className="col-md-6">
                    <Field
                        name="suggest.estimatedHours"
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
                        name="suggest.description"
                        component={renderTextArea}
                        label="Suggest Description:"
                        validate={isRightDisable?null:[required]}
                        readOnly={isRightDisable}
                    />
                </div>

            </div>
            <div className="row">
                <div className="col-md-6">
                    <Field
                        name="suggest.feature_id"
                        component={renderSelect}
                        label={"Feature:"}
                        options={props.features}
                        displayField={"estimator.name"}
                        disabled={isRightDisable}
                    />
                </div>
                <div className="col-md-6">
                    <Field
                        name="suggest.technologies"
                        component={renderMultiselect}
                        label="technologies:"
                        disabled={isRightDisable}
                        data={estimation.technologies}
                    />
                </div>
            </div>
        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" className="btn customBtn">{_id ? "Update" : "Submit"}</button>
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

const selector = formValueSelector('estimation-task')

EstimationTaskForm = connect(
    state => {
        const _id = selector(state, '_id')
        return {
            _id
        }
    }
)(EstimationTaskForm)


export default EstimationTaskForm