import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderText } from './fields'
import { required, number } from "./validation"
import * as logger from '../../clientLogger'
import { ROLE_TOP_MANAGEMENT } from '../../clientconstants'

let ClientForm = (props) => {
    const { handleSubmit, pristine, reset, submitting, loggedInUser } = props;
    logger.debug(logger.CLIENT_FORM_RENDER, props)

    let isManagementUser = false
    if (loggedInUser && loggedInUser.roleNames && loggedInUser.roleNames.length && loggedInUser.roleNames.indexOf(ROLE_TOP_MANAGEMENT))
        isManagementUser = true

    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6 col-md-offset-3">
                <Field name="name" placeholder={"Name of client"} component={renderText}
                    label={"Client Name:"} validate={[required]} />

                {isManagementUser && <Field name="billingRate" placeholder={"Billing rate"} component={renderText}
                    label={"Billing Rate:"} validate={[number]} />}
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Submit</button>
            </div>
        </div>

    </form>
}

ClientForm = reduxForm({
    form: 'client'
})(ClientForm)

export default ClientForm