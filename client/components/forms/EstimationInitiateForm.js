import {reduxForm, Field, Form} from 'redux-form'
import React from 'react'
import {required, email} from './validation'
import {renderText, renderTextArea, renderSelect} from './fields'
import * as logger from '../../clientLogger'

let EstimationInitiateForm = (props) => {
    logger.debug(logger.CLIENT_FORM_RENDER, props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="client._id" component={renderSelect} label={"Client Name:"} validate={[required]}/>
            </div>
        </div>
        <button type="submit" className="btn btn-submit">Submit</button>
    </form>
}

EstimationInitiateForm = reduxForm({
    form: 'estimation-initiate'
})(EstimationInitiateForm)

export default EstimationInitiateForm