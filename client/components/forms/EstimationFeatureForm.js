import {reduxForm, Field, Form, formValueSelector} from 'redux-form'
import React from 'react'
import {required} from './validation'
import {renderText, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from "react-redux";

let EstimationFeatureForm = (props) => {
    logger.debug(logger.ESTIMATION_FEATURE_FORM_RENDER, props)
    const {estimation, _id,reset} = props
    return <form onSubmit={props.handleSubmit}>
        <div className="row">

            <Field name="estimation._id" component="input" type="hidden"/>
            <Field name="_id" component="input" type="hidden"/>

            <div className="col-md-6">
                <Field name="name" component={renderText} label={"Feature Name:"} validate={[required]}/>
            </div>

        </div>
        <div className="row">
            <div className="col-md-12">
                <Field name="description" component={renderTextArea} label="Feature Description:"
                       validate={[required]} rows="10"/>
            </div>

        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" className="btn customBtn">{_id ? "Update" : "Submit"}</button>
            </div>
            <div className="col-md-6 text-center">
                <button type="button" className="btn customBtn" onClick={reset}>Reset</button>
            </div>
        </div>
    </form>
}

EstimationFeatureForm = reduxForm({
    form: 'estimation-feature'
})(EstimationFeatureForm)

const selector = formValueSelector('estimation-feature')

EstimationFeatureForm = connect(
    state => {
        const _id = selector(state, '_id')
        return {
            _id
        }
    }
)(EstimationFeatureForm)


export default EstimationFeatureForm