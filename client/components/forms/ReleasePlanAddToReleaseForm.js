import {Field, formValueSelector, reduxForm} from 'redux-form'
import React, {Component} from 'react'
import {renderText, renderTextArea} from './fields'
import {number, required} from "./validation"
import moment from 'moment'
import {withRouter} from 'react-router-dom'
import momentLocalizer from 'react-widgets-moment'
import _ from 'lodash'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()

class ReleasePlanAddToReleaseForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: [SC.ITERATION_TYPE_PLANNED]
        }
        this.showPlanSection = this.showPlanSection.bind(this)

    }

    showPlanSection(plan) {
        this.setState({status: SC.ITERATION_TYPE_UNPLANNED})

    }


    render() {
        const {pristine, submitting, change, reset} = this.props
        const {release, releasePlans} = this.props
        const {status} = this.state
        console.log("this.showPlans", status)
        return (<form onSubmit={this.props.handleSubmit}>
                <div className="row">

                    <Field name="estimation._id" component="input" type="hidden"/>
                    <div className="col-md-12">
                        {status ==SC.ITERATION_TYPE_PLANNED? <div className="col-md-6">
                            <Field name="billedHours" component={renderText} label={"Negotiated Billed Hours:"}
                                   validate={[required, number]}/>
                        </div> : null}

                        {status ==SC.ITERATION_TYPE_PLANNED ? <div className="col-md-6">
                            <Field name="estimatedHours" component={renderText}
                                   validate={[required, number]}
                                   label={"Estimated Hours:"}/>
                        </div> : null}

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
                            <select className="form-control SelectReleasePlanAddToRelease" title="Select..."
                                   onChange={(status) => this.showPlanSection(status.target.value)}>
                                <option value={SC.ITERATION_TYPE_PLANNED}>{SC.ITERATION_TYPE_PLANNED}</option>
                                <option value={SC.ITERATION_TYPE_UNPLANNED}>{SC.ITERATION_TYPE_UNPLANNED}</option>
                            </select>
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

export default withRouter(ReleasePlanAddToReleaseForm)
