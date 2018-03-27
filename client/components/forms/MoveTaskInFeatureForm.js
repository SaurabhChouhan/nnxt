import {required} from "./validation"
import React from 'react'
import {renderSelect} from "./fields"
import {Field, formValueSelector, reduxForm} from 'redux-form'

import {connect} from "react-redux";


let MoveTaskInFeatureForm = (props) => {
    const {estimator, handleSubmit, pristine, submitting, reset} = props
    console.log("estimator.name",estimator.name)
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-4">

                <Field name="_id" component="input" type="hidden"/>
                <Field name="feature_id" component={renderSelect} label={"Feature :"} options={props.features}
                       validate={[required]}
                       displayField="estimator.name"
                       optionalDisplayField="negotiator.name"
                />

                <button type="submit" disabled={pristine || submitting} className="btn customBtn"> Submit</button>
                <button type="button" disabled={pristine || submitting} className="btn customBtn" onClick={reset}>
                    Reset
                </button>
            </div>

        </div>

    </form>
}

MoveTaskInFeatureForm = reduxForm({
    form: 'move-task-in-feature'
})(MoveTaskInFeatureForm)

const selector = formValueSelector('move-task-in-feature')

MoveTaskInFeatureForm = connect(
    state => {
        const estimator = selector(state, 'estimator')
        return {
            estimator
        }
    }
)(MoveTaskInFeatureForm)

export default MoveTaskInFeatureForm