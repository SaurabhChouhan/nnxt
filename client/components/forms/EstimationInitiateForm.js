import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {required} from './validation'
import {renderMultiSelect, renderSelect, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from 'react-redux'

let EstimationInitiateForm = (props) => {
    logger.debug(logger.ESTIMATION_INITIATE_FORM_RENDER, props)
    const {reset, _id, pristine, submitting, handleSubmit} = props
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="_id" component="input" className="form-control" type="hidden"></Field>
                <Field name="project._id" component={renderSelect} label={"Project:"} options={props.projects}
                       validate={[required]}/>
            </div>
            <div className="col-md-6">
                <Field name="estimator._id" component={renderSelect} label={"Estimator:"} options={props.estimators}
                       displayField={"firstName"} validate={[required]}/>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <Field name="developmentType._id" component={renderSelect} label={"Development Type:"} options={props.developmentTypes}
                       displayField={"name"} validate={[required]}/>
            </div>
            <div className="col-md-6">
                <Field name="technologies" component={renderMultiSelect} label="technologies:"
                       data={props.technologies}/>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <Field name="description" component={renderTextArea} label="Description:" validate={[required]} rows="10"/>
            </div>
        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting}
                        className="btn customBtn">
                    {(!_id && "Submit") || (_id && "Update")}
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

EstimationInitiateForm = reduxForm({
    form: 'estimation-initiate'
})(EstimationInitiateForm)

const selector = formValueSelector('estimation-initiate')

EstimationInitiateForm = connect(
    state => {
        const _id = selector(state, '_id')
        return {
            _id
        }
    }
)(EstimationInitiateForm)

export default EstimationInitiateForm