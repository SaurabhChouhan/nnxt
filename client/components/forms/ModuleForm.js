import {required} from "./validation"
import {renderSelect, renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'

let ModuleForm = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of Module"} component={renderText}
                       label={"Module Name:"} validate={[required]}/>

                <Field name="Project._id" component={renderSelect} label={"Project :"} options={props.projects}
                       validate={[required]}/>

                <button type="submit" disabled={props.pristine || props.submitting} className="btn customBtn"> Submit
                </button>

            </div>

        </div>

    </form>
}

ModuleForm = reduxForm({
    form: 'module'
})(ModuleForm)

export default ModuleForm