import {required} from "./validation"
import {renderText} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'
import * as logger from "../../clientLogger";


let TechnologyForm = (props) => {
    logger.debug(logger.TECHNOLOGY_FORM_RENDER, "onSubmit: props:", props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of Technology"} component={renderText}
                       label={"Technology Name:"} validate={[required]}/>


                <button type="submit" disabled={props.pristine || props.submitting} className="btn customBtn">Submit
                </button>
            </div>
        </div>

    </form>
}

TechnologyForm = reduxForm({
    form: 'technology'
})(TechnologyForm)

export default TechnologyForm