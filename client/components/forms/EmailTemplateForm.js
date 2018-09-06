import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderTextArea, renderText, renderSelect} from './fields'
import {email, passwordLength, required} from "./validation"
import {connect} from 'react-redux'
import * as logger from '../../clientLogger'
import {EmailTypeFormContainer} from '../../containers'


class EmailTemplateForm extends Component {
    constructor(props) {
        super(props);
    }

    checkTemplateName(templateName){
        this.props.verifyTemplateName(templateName)
    }

    render() {
        console.log("allEmailTemplatesTypes", this.props.allEmailTemplatesTypes)
        return [
            <div key="UserFormBackButton">
                <button type="button"
                        onClick={() => this.props.showEmailTemplateList()}>
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>
            </div>,
            <div className="col-md-5">
            <form key="EmailTemplateForm" onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <Field name="_id" component="input" className="form-control" type="hidden"></Field>
                        <Field name="templateName" label="Name:" component={renderText} type="text"
                               validate={[required]} onkeyup={this.checkTemplateName(this.props.templateName)}/>
                        {this.props.isEmailTemplateNameExist ?
                            <h5 className="validation-error">Template name already exist!</h5>:null
                        }
                        <Field name="templateType" label="Type:" options={this.props.allEmailTemplatesTypes}
                               validate={[required]} component={renderSelect}/>
                        <Field name="templateSubject" label="Subject:" component={renderText} type="text"
                               validate={[required]}/>
                        <Field name="templateHeader" label="Header:" component={renderTextArea}
                               validate={[required]}/>
                        <Field name="templateBody" label="Body:" component={renderTextArea}
                               validate={[required]}/>
                        <Field name="templateFooter" label="Footer:" component={renderTextArea}
                               validate={[required]}/>
                        {this.props.isEmailTemplateNameExist ?
                            <button type="submit" className="btn btn-submit" disabled> {(!this.props._id && "Add") || (this.props._id && "Update")}
                            </button>
                            :<button type="submit" className="btn btn-submit"> {(!this.props._id && "Add") || (this.props._id && "Update")}
                            </button>
                        }
                    </div>
                </div>
            </form>
            </div>,
            <div className="col-md-5 col-md-offset-1">
            <EmailTypeFormContainer/>
            </div>
        ]

    }
}

EmailTemplateForm = reduxForm({
    form: 'emailTemplate'
})(EmailTemplateForm)

export default EmailTemplateForm
