import {required} from "./validation"
import {renderCheckBox, renderSelect, renderText} from "./fields"
import {Field, reduxForm,reset} from 'redux-form'
import React from 'react'


let EstimationFilterForm = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="repository" component={renderCheckBox} label={"Repository:"}/>
            </div>
            <div className="col-md-6">
                <Field name="estimator" component={renderCheckBox} label={"Estimator:"}/>
            </div>

        </div>
        <div className="row">
            <div className="col-md-6">
                <Field name="negotiator" component={renderCheckBox} label={"Negotiator:"}/>
            </div>
            <div className="col-md-6">
                <Field name="change_request" component={renderCheckBox} label={"Change-Request:"}/>
            </div>

        </div>
        <div className="row">
            <div className="col-md-6">
                <Field name="permission" component={renderCheckBox} label={"Permission Granted:"}/>
            </div>
            <div className="col-md-6">
                <Field name="suggestion" component={renderCheckBox} label={"Suggestion:"}/>
            </div>

        </div>

        <div className="row">
            <div className="col-md-6 text-right">
                <button type="submit" className="btn customBtn">Apply filter</button>
            </div>
            <div className="col-md-6 text-left">
                <button type="button" className="btn customBtn" onClick={reset}>Clear filter</button>
            </div>

        </div>

    </form>
}

EstimationFilterForm = reduxForm({
    form: 'Estimation-filter'
})(EstimationFilterForm)

export default EstimationFilterForm