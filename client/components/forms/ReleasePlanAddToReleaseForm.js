import {Field, formValueSelector, reduxForm} from 'redux-form'
import React, {Component} from 'react'
import {renderText, renderTextArea, renderSelect, renderCheckBox, renderDateTimePickerString} from './fields'
import {number, required} from "./validation"
import moment from 'moment'
import {connect} from 'react-redux'
import momentTZ from 'moment-timezone'
import {withRouter} from 'react-router-dom'
import momentLocalizer from 'react-widgets-moment'
import _ from 'lodash'
import * as SC from '../../../server/serverconstants'
import * as CC from "../../clientconstants";

moment.locale('en')
momentLocalizer()

class ReleasePlanAddToReleaseForm extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {pristine, submitting, change, reset} = this.props
        const {release, releasePlans, iterations, iteration_type, addDayTask} = this.props
        const devStartDateMoment = moment(momentTZ.utc(release.devStartDate).format(SC.DATE_FORMAT))
        const devEndDateMoment = moment(momentTZ.utc(release.devEndDate).format(SC.DATE_FORMAT))
        const min = devStartDateMoment.toDate()
        const max = devEndDateMoment.toDate()
        let employees =  release.team ;
        console.log("iteration_type", iteration_type)
        console.log('addDayTaskValue', addDayTask)
        return (<form onSubmit={this.props.handleSubmit}>
                <div className="row">

                    <Field name="estimation._id" component="input" type="hidden"/>
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
                        <div className="col-md-6">
                            <Field name="type" component={renderSelect} label={"Type:"} options={[
                                {_id: CC.TYPE_DEVELOPMENT, name: CC.TYPE_DEVELOPMENT},
                                {_id: CC.TYPE_MANAGEMENT, name: CC.TYPE_MANAGEMENT},
                                {_id: CC.TYPE_REVIEW, name: CC.TYPE_REVIEW},
                                {_id: CC.TYPE_TESTING, name: CC.TYPE_TESTING}
                            ]}
                                   showNoneOption={false}

                            />
                        </div>
                    </div>
                    <hr/>
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
                            <Field name="addDayTask"
                               type="checkbox"
                               label="addDayTask"
                               className="input checkbox planchk "
                               component={renderCheckBox}/>
                        </div>
                    </div>
                    {
                        addDayTask?
                    <div className="col-md-12">
                        <div className='col-md-4'>
                            <Field name="planningDate"
                                   placeholder={"Date"}
                                   component={renderDateTimePickerString}
                                   showTime={false}
                                   min={min}
                                   max={max}
                                   label={" Date :"} validate={[required]}/>
                        </div>
                        <div className='col-md-4'>
                            <Field name="planning.plannedHours"
                                   placeholder={"Enter Hours"}
                                   component={renderSelect}
                                   label={"Planning Hours:"}
                                   validate={[required, number]}
                                   options={
                                       [{'name': '0.5'}, {'name': '1'}, {'name': '1.5'}, {'name': '2'}, {'name': '2.5'}, {'name': '3'}, {'name': '3.5'},
                                           {'name': '4'}, {'name': '4.5'}, {'name': '5'}, {'name': '5.5'}, {'name': '6'}, {'name': '6.5'}, {'name': '7'},
                                           {'name': '7.5'}, {'name': '8'}, {'name': '8.5'}, {'name': '9'}, {'name': '9.5'}, {'name': '10'}, {'name': '10.5'}
                                           ,{'name': '11'}, {'name': '11.5'}, {'name': '12'}]}
                                   valueField={"name"}
                            />
                        </div>
                        <div className='col-md-4'>
                            <Field name="employee._id" placeholder={"Name of Developer"}
                                   component={renderSelect}
                                   options={employees}
                                   label={"Developer Name:"}
                                   onChange={(event, newValue, oldValue) => {
                                       // let employee = allTeam.find(e => e._id == newValue)
                                       // change("employee.name", employee.name)
                                   }}
                                   validate={[required]}/>
                        </div>
                    </div>:null
                    }
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

ReleasePlanAddToReleaseForm = reduxForm({
    form: 'release-plan-add-to-release'
})(ReleasePlanAddToReleaseForm)

const selector = formValueSelector('release-plan-add-to-release')

ReleasePlanAddToReleaseForm = connect(
    state => {
        const iteration_type = selector(state, 'iteration_type')
        const addDayTask = selector(state, 'addDayTask')
        return {
            iteration_type,
            addDayTask
        }
    }
)(ReleasePlanAddToReleaseForm)

export default withRouter(ReleasePlanAddToReleaseForm)
