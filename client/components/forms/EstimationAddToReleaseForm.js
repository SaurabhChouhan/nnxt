import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {renderDateTimePickerString, renderSelect, renderText} from './fields'
import * as logger from '../../clientLogger'
import {number, required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from 'lodash'

moment.locale('en')
momentLocalizer()

let EstimationAddToReleaseForm = (props) => {
    const {pristine, submitting, change, reset} = props
    const {devStartDate, devReleaseDate, clientReleaseDate, allAvailableReleases, release} = props
    let max = !_.isEmpty(devReleaseDate) ? moment(devReleaseDate).toDate() : !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined
    let maxRelease = !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined
    let now = new Date()
    return <form onSubmit={props.handleSubmit}>
        <div className="row">

            <Field name="estimation._id" component="input" type="hidden"/>

            <div className="col-md-12">
                <div className="col-md-4">
                    <Field name="billedHours" component={renderText} label={"Negotiated Billed Hours:"}
                           validate={[required, number]}/>
                </div>
                <div className="col-md-4">
                    <Field name="name" component={renderText} label={"Name (Iteration):"}
                           validate={[required]}/>
                </div>
                <div className="col-md-4">
                    <Field name="release._id" component={renderSelect} options={allAvailableReleases}
                           validate={[required]}
                           label={"Release:"}/>
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
                           min={moment(devStartDate).toDate()}
                           max={maxRelease}
                           showTime={false}
                           label={"Expected Developer Release Date:"} validate={[required]}/>
                </div>
                <div className="col-md-4">
                    <Field name="clientReleaseDate" component={renderDateTimePickerString}
                           min={moment(devReleaseDate).toDate()}
                           showTime={false}
                           label={"Expected Client Release Date:"}
                           validate={required}/>
                </div>
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

EstimationAddToReleaseForm = reduxForm({
    form: 'estimation-add-to-release'
})(EstimationAddToReleaseForm)

const selector = formValueSelector('estimation-add-to-release')

EstimationAddToReleaseForm = connect(
    state => {
        const {devStartDate, devReleaseDate, clientReleaseDate} = selector(state, 'devStartDate', 'devReleaseDate', 'clientReleaseDate')
        return {
            devStartDate,
            devReleaseDate,
            clientReleaseDate
        }
    }
)(EstimationAddToReleaseForm)


export default EstimationAddToReleaseForm