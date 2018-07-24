import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {number, required} from './validation'
import {renderSelect, renderText, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import * as CC from '../../clientconstants'
import {connect} from "react-redux";

let EstimationTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {_id, pristine, submitting, reset, features, handleSubmit, isFromRepo} = props
    return <form onSubmit={handleSubmit}>
        <div className="row">

            <Field name="estimation._id" component="input" type="hidden"/>
            <Field name="_id" component="input" type="hidden"/>

            <div className="col-md-6">
                <Field name="name" readOnly={isFromRepo} component={renderText} label={"Task Name:"}
                       validate={[required]}/>
            </div>
            <div className="col-md-6">
                <Field name="estimatedHours" component={renderText} label={"Estimated Hours:"}
                       validate={[required, number]}/>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <Field name="description" readOnly={isFromRepo} component={renderTextArea} label="Task Description:"
                       validate={[required]}
                       rows="10"/>
            </div>

        </div>
        {/* User would not be able to update feature during update operation, he would have to move task to feature or move out of it*/}
        {!_id &&
        <div className="row">
            <div className="col-md-6">
                <Field name="feature._id" readOnly={isFromRepo} component={renderSelect} label={"Feature:"}
                       options={features}
                       valueField="_id"
                       displayField="estimator.name"
                       optionalDisplayField="negotiator.name"
                />
            </div>
            <div className="col-md-6">
                <Field name="type" component={renderSelect} label={"Type:"} options={[
                    {_id: CC.TYPE_DEVELOPMENT, name: CC.TYPE_DEVELOPMENT},
                    {_id: CC.TYPE_MANAGEMENT, name: CC.TYPE_MANAGEMENT},
                    {_id: CC.TYPE_REVIEW, name: CC.TYPE_REVIEW},
                    {_id: CC.TYPE_TESTING, name: CC.TYPE_TESTING}
                ]}
                       showNoneOption={false}

                />
            </div>
        </div>
        }
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting}
                        className="btn customBtn">{_id ? "Update" : "Submit"}
                </button>
            </div>
            <div className="col-md-6 text-center">
                <button type="button" disabled={pristine || submitting} className="btn customBtn" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    </form>
}

EstimationTaskForm = reduxForm({
    form: 'estimation-task'
})(EstimationTaskForm)

const selector = formValueSelector('estimation-task')

EstimationTaskForm = connect(
    state => {
        const {_id, isFromRepo} = selector(state, '_id', 'isFromRepo')
        return {
            _id,
            isFromRepo
        }
    }
)(EstimationTaskForm)


export default EstimationTaskForm