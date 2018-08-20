import {required} from "./validation"
import {renderSelect, renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'

let ProjectForm = (props) => {
    const {reset, pristine, submitting, handleSubmit, clients} = props
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of project"} component={renderText}
                       label={"Project Name:"} validate={[required]}/>

                <Field name="client._id" component={renderSelect} label={"Client :"} options={clients}
                       validate={[required]}/>

                <button type="submit" disabled={pristine || submitting} className="btn customBtn"> Submit
                </button>

            </div>

        </div>

    </form>
}

ProjectForm = reduxForm({
    form: 'project'
})(ProjectForm)

export default ProjectForm