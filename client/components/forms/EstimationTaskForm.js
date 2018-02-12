import {reduxForm, Field, formValueSelector} from 'redux-form'
import React from 'react'
import {required, number} from './validation'
import {renderText, renderTextArea, renderSelect, renderMultiselect} from './fields'
import * as logger from '../../clientLogger'
import {connect} from "react-redux";

let EstimationTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {estimation, _id} = props
    return <form onSubmit={props.handleSubmit}>
        <div className="row">

            <Field name="estimation._id" component="input" type="hidden"/>
            <Field name="_id" component="input" type="hidden"/>

            <div className="col-md-6">
                <Field name="name" component={renderText} label={"Task Name:"} validate={[required]}/>
            </div>
            <div className="col-md-6">
                <Field name="estimatedHours" component={renderText} label={"Estimated Hours:"}
                       validate={[required, number]}/>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <Field name="description" component={renderTextArea} label="Task Description:" validate={[required]}
                       rows="10"/>
            </div>

        </div>
        {/* User would not be able to update feature during update operation, he would have to move task to feature or move out of it*/}
        {!_id &&
        <div className="row">
            <div className="col-md-6">
                <Field name="feature._id" component={renderSelect} label={"Feature:"} options={props.features}
                       displayField={"estimator.name"}/>
            </div>
        </div>
        }
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
    form: 'estimation-task'
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