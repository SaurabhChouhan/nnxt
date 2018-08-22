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

let CreateReleaseForm = (props) => {
    //logger.debug(logger.ESTIMATION_PROJECT_AWARD_FORM_RENDER, props)
    const {pristine, submitting, reset, change} = props
    const {team, managers, leaders, devStartDate, devReleaseDate, clientReleaseDate, manager, leader} = props
    let max = !_.isEmpty(devReleaseDate) ? moment(devReleaseDate).toDate() : !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined
    let maxRelease = !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined

    /*
        While creating/adding release to an estimation, an user which is chosen as a Manager cannot be chosen as Leader and vice versa.
        A manager/leader can be chose as Developer if they have that role as well.
    */

    let updatedManagerList = leader && leader._id ? managers.filter(m => m._id.toString() !== leader._id.toString()) : managers
    let updatedLeaderList = manager && manager._id ? leaders.filter(l => l._id.toString() !== manager._id.toString()) : leaders
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
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="manager._id"
                           component={renderSelect}
                           label={"Manager Of Release:"}
                           options={updatedManagerList}
                           validate={required}
                           valueField="_id"
                           displayField="Name"
                    />
                </div>
                <div className="col-md-6">

                    <Field name="leader._id"
                           component={renderSelect}
                           label={"Leader Of Release:"}
                           options={updatedLeaderList}
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
                       data={team}
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

CreateReleaseForm = reduxForm({
    form: 'create-release'
})(CreateReleaseForm)

const selector = formValueSelector('create-release')

CreateReleaseForm = connect(
    state => {
        const {devStartDate, devReleaseDate, clientReleaseDate} = selector(state, 'devStartDate', 'devReleaseDate', 'clientReleaseDate')
        const manager = selector(state, 'manager')
        const leader = selector(state, 'leader')
        return {
            devStartDate,
            devReleaseDate,
            clientReleaseDate,
            manager,
            leader
        }
    }
)(CreateReleaseForm)


export default CreateReleaseForm