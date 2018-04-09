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
                <Field name="addedFromRepository" component={renderCheckBox}
                       label={"Added From Repository"}
                />
                <Field name="addedByNegotiator" component={renderCheckBox}
                       label={"Currently Added By You"}
                />
                <Field name="addedByEstimator" component={renderCheckBox}
                       label={"Currently Added By" + estimation.estimator.firstName + " " + estimation.estimator.lastName}
                />
            </div>
            }
            {estimation.loggedInUserRole == SC.ROLE_ESTIMATOR &&
            <div className="col-md-12">
                <div className="col-md-5">
                <Field name="changedByEstimator" component={renderCheckBox} label={"Changed By You:"}/>
                    <Field name="permissionRequested" component={renderCheckBox}
                           label={"Requested Permissions"}
                    />
                </div>
                <div className="col-md-7">
                <Field name="changedByNegotiator" component={renderCheckBox}
                       label={"Suggested By :" + estimation.negotiator.firstName + " " + estimation.negotiator.lastName}
                />
                    <Field name="addedFromRepository" component={renderCheckBox}
                           label={"Added From Repository"}
                />
                    <Field name="addedByNegotiator" component={renderCheckBox}
                           label={"Currently Added By You"}
                    />
                    <Field name="addedByEstimator" component={renderCheckBox}
                           label={"Currently Added By" + estimation.estimator.firstName + " " + estimation.estimator.lastName}
                    />
            </div>
            </div>

            }
            <button type="submit" disabled={pristine || submitting} className="btn customBtn moveInBtnSpace ">
               Apply Filter
            </button>
            <button type="button" disabled={pristine || submitting} className="btn customBtn"
                    onClick={() => props.clearFilter()}>Clear Filter
            </button>
        </div>
    </form>
}

EstimationFilterForm = reduxForm({
    form: 'Estimation-filter'
})(EstimationFilterForm)

export default EstimationFilterForm