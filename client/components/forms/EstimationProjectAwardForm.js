import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {renderDateTimePickerString, renderMultiSelect, renderSelect, renderText} from './fields'
import * as logger from '../../clientLogger'
import {number, required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from 'lodash'

moment.locale('en')
momentLocalizer()

let EstimationProjectAwardForm = (props) => {
    logger.debug(logger.ESTIMATION_PROJECT_AWARD_FORM_RENDER, props)
    const {pristine, submitting, reset, change} = props
    const {Team, Managers, Leaders, devStartDate, devReleaseDate, clientReleaseDate} = props
    let max = !_.isEmpty(devReleaseDate) ? moment(devReleaseDate).toDate() : !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined
    console.log("max", max)
    let now = new Date()
    return <form onSubmit={props.handleSubmit}>
        <div className="row">

            <Field name="estimation._id" component="input" type="hidden"/>
            <Field name="_id" component="input" type="hidden"/>

            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="billedHours" component={renderText} label={"Negotiated Billed Hours:"}
                           validate={[required, number]}/>
                </div>
                <div className="col-md-6">
                    <Field name="releaseVersionName" component={renderText} validate={[required]}
                           label={"Name (Relese Version):"}/>
                </div>
            </div>
            <div className="col-md-12">
                <div className="col-md-4">
                    <Field name="devStartDate" component={renderDateTimePickerString}
                           min={now}
                           max={max}
                           showTime={false}
                           label={"Expected Start Date For Developer:"} validate={[required]}/>
                </div>
                <div className="col-md-4">
                    <Field name="devReleaseDate" component={renderDateTimePickerString}
                           min={moment(devStartDate).toDate()} showTime={false}
                           label={"Expected Developer Release Date:"} validate={[required]}/>
                </div>
                <div className="col-md-4">
                    <Field name="clientReleaseDate" component={renderDateTimePickerString}
                           min={moment(devStartDate).toDate()} showTime={false}
                           label={"Expected Client Release Date:"} validate={required}/>
                </div>
            </div>
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="manager._id"
                           component={renderSelect}
                           label={"Manager Of Release:"}
                           options={Managers}
                           validate={required}
                           valueField="_id"
                           displayField="Name"
                    />
                </div>
                <div className="col-md-6">

                    <Field name="leader._id"
                           component={renderSelect}
                           label={"Leader Of Release:"}
                           options={Leaders}
                           validate={required}
                           valueField="_id"
                           displayField="Name"
                    />
                </div>
            </div>

            <div className="col-md-12">
                <Field name="team"
                       component={renderMultiSelect}
                       label={"Planned Employees For Release:"}
                       data={Team}
                       validate={required}
                       textField="name"
                       valueField="_id"
                />
            </div>

        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Submit</button>
            </div>
            <div className="col-md-6 text-center">
                <button type="button" disabled={pristine || submitting} onClick={reset} className="btn customBtn">
                    Reset
                </button>
            </div>
        </div>
    </form>
}

EstimationProjectAwardForm = reduxForm({
    form: 'estimation-project-award'
})(EstimationProjectAwardForm)

const selector = formValueSelector('estimation-project-award')

EstimationProjectAwardForm = connect(
    state => {
        const {devStartDate, devReleaseDate, clientReleaseDate} = selector(state, 'devStartDate', 'devReleaseDate', 'clientReleaseDate')
        return {
            devStartDate,
            devReleaseDate,
            clientReleaseDate
        }
    }
)(EstimationProjectAwardForm)


export default EstimationProjectAwardForm