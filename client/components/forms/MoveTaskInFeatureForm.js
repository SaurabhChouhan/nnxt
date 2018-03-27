import {required} from "./validation"
import React from 'react'
import {renderSelect} from "./fields"
import {Field, reduxForm} from 'redux-form'


let MoveTaskInFeatureForm = (props) => {
    const {handleSubmit, pristine, submitting, reset} = props
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

export default MoveTaskInFeatureForm