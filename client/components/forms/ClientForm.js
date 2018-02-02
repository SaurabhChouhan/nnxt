import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText} from './fields'
import {required} from "./validation"
import * as logger from '../../clientLogger'

let ClientForm = (props) => {
    logger.debug(logger.CLIENT_FORM_RENDER, props)
    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Name of client"} component={renderText}
                       label={"Client Name:"} validate={[required]}/>

                <button type="submit" className="btn customBtn">Submit</button>
            </div>
        </div>

    </form>
}

ClientForm = reduxForm({
    form: 'client'
})(ClientForm)

export default ClientForm