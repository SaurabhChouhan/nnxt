import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText, renderTextArea} from './fields'
import {required} from "./validation"

class PermissionForm extends Component {

    render() {
        return [
            <div key="PermissionFormBackButton">
                <button type="button"
                        onClick={() => this.props.showPermissionList() }>
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>
            </div>,
            <form key="PermissionForm" onSubmit={this.props.handleSubmit}>
            <div className="row">
                <div className="col-md-4">
                    <Field name="name" placeholder={"Name of permission"} component={renderText}
                           label={"Permission"} validate={[required]}/>
                    <button type="submit" className="btn btn-submit">Submit</button>
                </div>
            </div>
        </form>]

    }
}

PermissionForm = reduxForm({
    form: 'permission'
})(PermissionForm)

export default PermissionForm