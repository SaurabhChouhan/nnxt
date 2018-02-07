import {reduxForm, Field, Form} from 'redux-form'
import React from 'react'
import {required, email, number} from './validation'
import {renderText, renderTextArea, renderSelect, renderMultiselect} from './fields'
import * as logger from '../../clientLogger'

let EstimationTaskForm = (props) => {
    logger.debug(logger.ESTIMATION_TASK_FORM_RENDER, props)
    const {estimation} = props
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
                <Field name="description" component={renderTextArea} label="Task Description:" validate={[required]}/>
            </div>

        </div>
        <div className="row">
            <div className="col-md-6">
                <Field name="feature._id" component={renderSelect} label={"Feature:"} options={estimation.features}
                       displayField={"estimator.name"}/>
            </div>
            <div className="col-md-6">
                <Field name="technologies" component={renderMultiselect} label="technologies:"
                       data={estimation.technologies}/>
            </div>
        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" className="btn customBtn">Submit</button>
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

export default EstimationTaskForm