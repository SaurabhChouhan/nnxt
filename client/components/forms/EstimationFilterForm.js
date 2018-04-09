import {renderCheckBox} from "./fields"
import {Field, reduxForm} from 'redux-form'
import React from 'react'
import * as SC from "../../../server/serverconstants";


let EstimationFilterForm = (props) => {
    const {handleSubmit, pristine, reset, submitting} = props;
    const {estimation} = props;

    return <form onSubmit={handleSubmit}>
        <div className="col-md-12">
            {estimation.loggedInUserRole == SC.ROLE_NEGOTIATOR &&
            <div className="col-md-12">
                <Field name="changedByNegotiator" component={renderCheckBox} label={"Suggested By You:"}/>
                <Field name="changedByEstimator" component={renderCheckBox}
                       label={"Changed By :" + estimation.estimator.firstName + " " + estimation.estimator.lastName}
                />
                <Field name="permissionRequested" component={renderCheckBox}
                       label={"Requested Permissions"}
                />
                <Field name="permissionGranted" component={renderCheckBox}
                       label={"Granted Permissions"}
                />
            </div>
            }
            {estimation.loggedInUserRole == SC.ROLE_ESTIMATOR &&
            <div className="col-md-12">
                <Field name="changedByEstimator" component={renderCheckBox} label={"Changed By You:"}/>
                <Field name="changedByNegotiator" component={renderCheckBox}
                       label={"Suggested By :" + estimation.negotiator.firstName + " " + estimation.negotiator.lastName}
                />
                <Field name="permissionRequested" component={renderCheckBox}
                       label={"Requested Permissions"}
                />
                <Field name="permissionGranted" component={renderCheckBox}
                       label={"Granted Permissions"}
                />
            </div>
            }
            <button type="submit" disabled={pristine || submitting} className="btn squareButton">
               Apply Filter
            </button>
            <button type="button" disabled={pristine || submitting} className="btn squareButton"
                    onClick={reset}>Clear Filter
            </button>
        </div>
    </form>
}

EstimationFilterForm = reduxForm({
    form: 'Estimation-filter'
})(EstimationFilterForm)

export default EstimationFilterForm