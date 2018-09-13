import {Field, formValueSelector, reduxForm} from 'redux-form'
import React, {Component} from 'react'
import {renderText, renderTextArea, renderSelect} from './fields'
import {number, required} from "./validation"
import moment from 'moment'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import momentLocalizer from 'react-widgets-moment'
import _ from 'lodash'
import * as SC from '../../../server/serverconstants'
import * as CC from "../../clientconstants";

moment.locale('en')
momentLocalizer()

class UpdateReleasePlanForm extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {pristine, submitting, change, reset} = this.props
        const {iteration_type} = this.props
        return (<form onSubmit={this.props.handleSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        {iteration_type === SC.ITERATION_TYPE_PLANNED && <div className="col-md-6">
                            <Field name="estimatedBilledHours" component={renderText} label={"Negotiated Billed Hours:"}
                                   validate={[required, number]}/>
                        </div>}

                        {iteration_type === SC.ITERATION_TYPE_PLANNED && <div className="col-md-6">
                            <Field name="estimatedHours" component={renderText}
                                   validate={[required, number]}
                                   label={"Estimated Hours:"}/>
                        </div>}

                    </div>
                    <div className="col-md-12">
                        <div className="col-md-12">
                            <Field name="name" component={renderText} label={"Name:"} validate={[required]}/>

                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-12">
                            <Field name="description" component={renderTextArea} label="Description:"
                                   validate={[required]} rows="10"/>
                        </div>
                    </div>
                </div>
                <div className="row initiatEstimation">
                    <div className="col-md-6 text-center">
                        <button type="submit" disabled={pristine || submitting} className="btn customBtn">Submit
                        </button>
                    </div>
                    <div className="col-md-6 text-center">
                        <button type="button" disabled={pristine || submitting} onClick={reset}
                                className="btn customBtn">
                            Reset
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

UpdateReleasePlanForm = reduxForm({
    form: 'update-release-plan'
})(UpdateReleasePlanForm)

const selector = formValueSelector('update-release-plan')

UpdateReleasePlanForm = connect(
    state => {
        const iteration_type = selector(state, 'iteration_type')
        return {
            iteration_type
        }
    }
)(UpdateReleasePlanForm)

export default withRouter(UpdateReleasePlanForm)
