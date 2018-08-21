import {required} from "./validation"
import {renderSelect, renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'

let ModuleForm = (props) => {
    const {reset, pristine, submitting, handleSubmit, projects} = props
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of Module"} component={renderText}
                       label={"Module Name:"} validate={[required]}/>

                <Field name="project._id" component={renderSelect} label={"Project :"} options={projects}
                       validate={[required]}/>

                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Submit</button>

            </div>

        </div>

    </form>
}

ModuleForm = reduxForm({
    form: 'module'
})(ModuleForm)

export default ModuleForm