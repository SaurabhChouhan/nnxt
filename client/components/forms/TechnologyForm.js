import {required} from "./validation"
import {renderSelect, renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'


let TechnologyForm=(props)=> {
    console.log("You are technology Form",props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of Technology"} component={renderText}
                       label={"Technology Name:"} validate={[required]}/>

            </div>
        </div>
        <button type="submit" className="btn btn-submit">Submit</button>
    </form>
}

TechnologyForm =reduxForm({
    form:'technology'
})(TechnologyForm)

export default TechnologyForm