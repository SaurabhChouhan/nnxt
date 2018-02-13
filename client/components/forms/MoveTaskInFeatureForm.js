import {required} from "./validation"
import {renderSelect, renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'


let MoveTaskInFeatureForm = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">

                <Field name="_id" component="input" type="hidden"/>
                <Field name="feature_id" component={renderSelect} label={"Feature :"} options={props.features}
                       validate={[required]} displayField="estimator.name"/>

                <button type="submit" className="btn customBtn"> Submit</button>

            </div>

        </div>

    </form>
}

MoveTaskInFeatureForm = reduxForm({
    form: 'MoveTaskInFeatureForm'
})(MoveTaskInFeatureForm)

export default MoveTaskInFeatureForm