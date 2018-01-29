import {required} from "./validation"
import {renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'

let ProjectForm=props=>{
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of project"} component={renderText}
                       label={"Project Name:"} validate={[required]}/>
            </div>
        </div>
        <button type="submit" className="btn btn-submit">Submit</button>
    </form>
}

ProjectForm =reduxForm({
    form:'project'
})(ProjectForm)

export default ProjectForm