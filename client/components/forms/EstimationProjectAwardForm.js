import {Field, reduxForm} from 'redux-form'
import React from 'react'
import {renderMultiselect, renderSelect, renderText} from './fields'
import * as logger from '../../clientLogger'
import {number, required} from "./validation"


let EstimationProjectAwardForm = (props) => {
    logger.debug(logger.ESTIMATION_PROJECT_AWARD_FORM_RENDER, props)
    const {pristine, submitting,reset} = props
    const {Team, Managers, Leaders} = props
    return <form onSubmit={props.handleSubmit}>
        <div className="row">

            <Field name="estimation._id" component="input" type="hidden"/>
            <Field name="_id" component="input" type="hidden"/>

            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="billedHours" component={renderText} label={"Negotiated Billed Hours:"}  validate={[number]}/>
                </div>
                <div className="col-md-6">
                    <Field name="releaseVersionName" component={renderText} validate={[required]} label={"Name (Relese Version):"}/>
                </div>
            </div>
            <div className="col-md-12">
                <div className="col-md-4">
                    <Field name="devStartDate:" component={renderText}
                           label={"Expected Start Date For Developer:"} validate={[required]} />
                </div>
                <div className="col-md-4">
                    <Field name="devReleaseDate" component={renderText}
                           label={"Expected Developer Release Date:"} validate={[required]} />
                </div>
                <div className="col-md-4">
                    <Field name="clientReleaseDate" component={renderText}
                           label={"Expected Client Release Date:"} validate={[required]} />
                </div>
            </div>
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="manager" component={renderSelect} label={"Manager Of Release:"}
                           options={Managers} valueField="_id" displayField="firstName"
                    />
                </div>
                <div className="col-md-6">
                    <Field name="leader" component={renderSelect} label={"Leader Of Release:"}
                           options={Leaders} valueField="_id" displayField="firstName"
                    />
                </div>
            </div>

            <div className="col-md-12">

                <Field name="team"
                       component={renderMultiselect} label={"Planned Employees For Release:"}
                       data={Team} valueField="_id" textField="firstName"
                />
            </div>

        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Submit</button>
            </div>
            <div className="col-md-6 text-center">
                <button type="button" disabled={pristine || submitting} onClick={reset} className="btn customBtn">Reset</button>
            </div>
        </div>
    </form>
}

EstimationProjectAwardForm = reduxForm({
    form: 'estimation-project-award'
})(EstimationProjectAwardForm)

export default EstimationProjectAwardForm