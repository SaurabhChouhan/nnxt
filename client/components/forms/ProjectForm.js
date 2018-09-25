import {required} from "./validation"
import {renderSelect, renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'

let ProjectForm = (props) => {
    const {reset, pristine, submitting, handleSubmit, clients} = props
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="name" placeholder={"Name of project"} component={renderText}
                           label={"Project Name:"} validate={[required]}/>
                </div>
                <div className="col-md-6">
                    <Field name="client._id" component={renderSelect} label={"Client :"} options={clients}
                           validate={[required]}/>
                </div>
            </div>

            <div className="row initiatEstimation">
                <div className="col-md-6 text-center">
                    <button type="submit" disabled={pristine || submitting} className="btn customBtn"> Submit
                    </button>
                </div>
            </div>
        </div>

    </form>
}

ProjectForm = reduxForm({
    form: 'project'
})(ProjectForm)

export default ProjectForm