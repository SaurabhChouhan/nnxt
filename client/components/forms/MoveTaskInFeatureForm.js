import {required} from "./validation"
import React from 'react'
import {renderSelect} from "./fields"
import {Field, reduxForm} from 'redux-form'


let MoveTaskInFeatureForm = (props) => {
    const {handleSubmit, pristine, submitting, reset, features} = props
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-9">

                <Field name="_id" component="input" type="hidden"/>
                <Field name="featureID" component={renderSelect} label={"Feature :"} options={features}
                       valueField="_id"
                       validate={[required]}
                       displayField="estimator.name"
                       optionalDisplayField="negotiator.name"
                />

                <button type="submit" disabled={pristine || submitting} className="btn customBtn moveInBtnSpace">
                    Submit
                </button>
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