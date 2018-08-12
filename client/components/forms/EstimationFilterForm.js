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
            <div className="col-md-12 filterTextWithFlag">
                <div>
                    <Field name="changedByNegotiator" component={renderCheckBox} label={"Suggested By You"}/>
                    <img key="negotiator_edit_flag" src="/images/negotiator_edit_flag.png"
                         className="filterFlag"
                         title="Suggested by Negotiator"/>
                </div>
                <div>
                    <Field name="addedByNegotiator" component={renderCheckBox}
                           label={"Added By You"}
                    />
                    <img key="negotiator_new_flag" src="/images/negotiator_new_flag.png"
                         className="filterFlag"
                         title="Added by Negotiator"/>

                </div>
                <div>
                    <Field name="changedByEstimator" component={renderCheckBox}
                           label={"Changed By : " + estimation.estimator.firstName + " " + estimation.estimator.lastName}
                    />
                    <img key="estimator_edit_flag" src="/images/estimator_edit_flag.png"
                         className="filterFlag"
                         title="Changed by Estimator"/>
                </div>
                <div>
                    <Field name="addedByEstimator" component={renderCheckBox}
                           label={"Added By: " + estimation.estimator.firstName + " " + estimation.estimator.lastName}
                    />
                    <img key="estimator_new_flag" src="/images/estimator_new_flag.png"
                         className="filterFlag" title="Added by Estimator"/>

                </div>
                <div>
                    <Field name="permissionRequested" component={renderCheckBox}
                           label={"Requested Permissions"}
                    />
                    <img key="estimator_requested_permission_flag" src="/images/request_flag.png"
                         className="filterFlag"
                         title="Requested by Estimator"/>
                </div>

                <div>
                    <Field name="addedFromRepository" component={renderCheckBox}
                           label={"Added From Repository"}
                    />
                    <img key="repo_flag" src="/images/repo_flag.png" className="filterFlag"
                         title="From Repository"/>
                </div>
                <div>
                    <Field name="hasError" component={renderCheckBox}
                           label={"Error in Task/Feature"}
                    />
                    <img key="exclamation" src="/images/exclamation.png"
                         className="filterFlag"
                         title="hasError"/>
                </div>
            </div>
            }
            {estimation.loggedInUserRole == SC.ROLE_ESTIMATOR &&
            <div className="col-md-12 filterTextWithFlag">

                <div>
                    <Field name="changedByEstimator" component={renderCheckBox} label={"Changed By You"}/>
                    <img key="estimator_edit_flag" src="/images/estimator_edit_flag.png"
                         className="filterFlag"
                         title="Changed by Estimator"/>
                </div>
                <div>
                    <Field name="addedByEstimator" component={renderCheckBox}
                           label={"Added By You"}
                    />
                    <img key="estimator_new_flag" src="/images/estimator_new_flag.png"
                         className="filterFlag" title="Added by Estimator"/>
                </div>
                <div>
                    <Field name="permissionRequested" component={renderCheckBox}
                           label={"Requested Permissions"}
                    />
                    <img key="estimator_requested_permission_flag" src="/images/request_flag.png"
                         className="filterFlag"
                         title="Requested by Estimator"/>
                </div>
                <div>
                    <Field name="changedByNegotiator" component={renderCheckBox}
                           label={"Suggested By : " + estimation.negotiator.firstName + " " + estimation.negotiator.lastName}
                    />
                    <img key="negotiator_edit_flag" src="/images/negotiator_edit_flag.png"
                         className="filterFlag"
                         title="Suggested by Negotiator"/>
                </div>
                <div>
                    <Field name="addedByNegotiator" component={renderCheckBox}
                           label={"Added By: " + estimation.negotiator.firstName + " " + estimation.negotiator.lastName}
                    />
                    <img key="negotiator_new_flag" src="/images/negotiator_new_flag.png"
                         className="filterFlag"
                         title="Added by Negotiator"/>

                </div>

                <div>
                    <Field name="addedFromRepository" component={renderCheckBox}
                           label={"Added From Repository"}
                    />
                    <img key="repo_flag" src="/images/repo_flag.png" className="filterFlag"
                         title="From Repository"/>
                </div>
                <div>
                    <Field name="hasError" component={renderCheckBox}
                           label={"Error in Task/Feature"}
                    />
                    <img key="exclamation" src="/images/exclamation.png"
                         className="filterFlag"
                         title="hasError"/>
                </div>

            </div>

            }

            <div className={"col-md-12 text-center"}>

                <button type="button" className="btn secondaryBtn"
                        title={estimation.loggedInUserRole == SC.ROLE_ESTIMATOR ? 'Changed by ' + estimation.negotiator.firstName : 'Changed by ' + estimation.estimator.firstName}
                        onClick={() => props.newChangedFilter(props.estimation.status)}><i
                    className={"fa fa-pencil"}></i></button>
                <button type="button" className="btn secondaryBtn" title={"Select All Filters"}
                        onClick={() => props.selectAllFilter()}><i className={"fa fa-list"}></i></button>
                <button type="button" className="btn secondaryBtn" title={"Clear All Filters"}
                        onClick={() => props.clearFilter()}><i className={"fa fa-cut"}></i></button>
            </div>

            <div className={"col-md-12 text-center"} style={{marginTop: "15px"}}>

                <button type="submit" disabled={pristine || submitting} className="btn customBtn  FilterBtn ">
                    Apply Filter
                </button>
            </div>

        </div>
    </form>
}

EstimationFilterForm = reduxForm({
    form: 'Estimation-filter'
})(EstimationFilterForm)

export default EstimationFilterForm