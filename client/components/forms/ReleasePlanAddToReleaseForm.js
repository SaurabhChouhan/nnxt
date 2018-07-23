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

moment.locale('en')
momentLocalizer()

class ReleasePlanAddToReleaseForm extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {pristine, submitting, change, reset} = this.props
        const {release, releasePlans, iterations, iteration_type} = this.props
        console.log("iteration_type", iteration_type)
        return (<form onSubmit={this.props.handleSubmit}>
                <div className="row">

                    <Field name="estimation._id" component="input" type="hidden"/>
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
                        <div className="col-md-6">
                            <Field name="name" component={renderText} label={"Name:"} validate={[required]}/>

                        </div>
                    </div>
                    <div className="col-md-12">
                        <Field name="description" component={renderTextArea} label="Description:"
                               validate={[required]}/>
                    </div>

                    <div className="col-md-12">
                        <div className="col-md-6">
                            <Field name="iteration_type"
                                   component={renderSelect}
                                   className={"form-control SelectReleasePlanAddToRelease"}
                                   label="Select Iteration type:"
                                   options={iterations}
                                   displayField={"name"}
                                   valueField={"name"}
                            />
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

ReleasePlanAddToReleaseForm = reduxForm({
    form: 'release-plan-add-to-release'
})(ReleasePlanAddToReleaseForm)

const selector = formValueSelector('release-plan-add-to-release')

ReleasePlanAddToReleaseForm = connect(
    state => {
        const iteration_type = selector(state, 'iteration_type')
        return {
            iteration_type
        }
    }
)(ReleasePlanAddToReleaseForm)

export default withRouter(ReleasePlanAddToReleaseForm)
