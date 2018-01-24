import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText, renderTextArea} from './fields'
import {required} from "./validation"
import {ROLE_ADMIN} from "../../clientconstants"
import * as logger from '../../clientLogger'

let ClientForm = (props) => {
    logger.debug(logger.CLIENT_FORM_RENDER, props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of client"} component={renderText}
                       label={"Client Name:"} validate={[required]}/>
            </div>
        </div>
        <button type="submit" className="btn btn-submit">Submit</button>
    </form>
}

ClientForm = reduxForm({
    form: 'client'
})(ClientForm)

export default ClientForm