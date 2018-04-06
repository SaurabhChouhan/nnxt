import {renderCheckBox} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'
import * as SC from "../../../server/serverconstants";


let EstimationFilterForm = (props) => {
    const {handleSubmit, pristine, reset, submitting} = props;

    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">

                <Field name="repository" component={renderCheckBox} label={"Repository:"}/>
            </div>
            <div className="col-md-6">
                {props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                <Field name="negotiator" component={renderCheckBox} label={"Negotiator:"}
                />}

                {props.loggedInUser.roleNames.includes(SC.ROLE_ESTIMATOR) &&
                <Field name="estimator" component={renderCheckBox} label={"Estimator:"}
                />}


            </div>

        </div>
        <div className="row">
            <div className="col-md-6">
                {props.loggedInUser.roleNames.includes(SC.ROLE_ESTIMATOR) &&
                <Field name="grantPermission" component={renderCheckBox} label={"Permission Granted:"}
                />}

                {props.loggedInUser.roleNames.includes(SC.ROLE_NEGOTIATOR) &&
                <Field name="changeRequested" component={renderCheckBox} label={"Change-Request:"}
                />}
            </div>
            <div className="col-md-6">
                <Field name="suggestions" component={renderCheckBox} label={"Suggestion:"}
                />
            </div>

        </div>

        <div className="row">
            <div className="col-md-6 text-right">
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">
                    Apply filter
                </button>
            </div>
            <div className="col-md-6 text-left">
                <button type="button" className="btn customBtn" disabled={pristine || submitting} onClick={reset}>
                    Clear filter
                </button>
            </div>

        </div>

    </form>
}

EstimationFilterForm = reduxForm({
    form: 'Estimation-filter'
})(EstimationFilterForm)

export default EstimationFilterForm