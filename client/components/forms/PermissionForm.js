import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText} from './fields'
import {required} from "./validation"

class PermissionForm extends Component {
    render() {
        const {handleSubmit} = this.props
        return [
            <div key="PermissionFormBackButton" className="col-md-12">
                <button className="glyphicon glyphicon-arrow-left customBtn pull-left btn" type="button" style={{margin:'10px 0px'}}
                        onClick={() => this.props.showPermissionList()}>
                </button>
            </div>,
            <form key="PermissionForm" onSubmit={handleSubmit}>
                <div className="clearfix">
                    <div className="col-md-4">
                        <Field name="name" placeholder={"Name of permission"} component={renderText}
                               label={"Permission"} validate={[required]}/>
                        <button type="submit" className="btn customBtn" style={{margin:'10px 0px'}}>Submit</button>
                    </div>
                </div>
            </form>]

    }
}

PermissionForm = reduxForm({
    form: 'permission'
})(PermissionForm)

export default PermissionForm