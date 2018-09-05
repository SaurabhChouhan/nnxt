import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderTextArea, renderText, renderSelect} from './fields'
import {email, passwordLength, required} from "./validation"
import {connect} from 'react-redux'
import * as logger from '../../clientLogger'


class EmailTypeForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return [
            <form key="EmailTypeForm" onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <Field name="_id" component="input" className="form-control" type="hidden"></Field>
                        <Field name="templateTypeName" label="Email Template Type:" component={renderText} type="text"
                               validate={[required]}/>
                        <button type="submit"
                                className="btn btn-submit"> Add </button>
                    </div>
                </div>
            </form>
        ]
    }
}

EmailTypeForm = reduxForm({
    form: 'email-type'
})(EmailTypeForm)

export default EmailTypeForm
