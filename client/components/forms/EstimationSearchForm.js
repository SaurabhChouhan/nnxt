import {Field, reduxForm} from 'redux-form'
import React from 'react'
import {renderSelect} from './fields'

let EstimationSearchForm = (props) => {
    const {projects} = props

    return <form className="estimationForm">
        <div className="col-md-12 estimationSearchProject">
            <Field
                name="projectID"
                className="form-control "
                component={renderSelect}
                placeholder="Select Project Name"
                options={projects}
                displayField="name"
                valueField="_id"
                noneOptionText="All Projects"
                noneOptionValue="All"
                onChange={(event, newValue, oldValue) => {
                    props.filterEstimationByProject(newValue)
                }}
            />
        </div>
    </form>
}

EstimationSearchForm = reduxForm({
    form: 'estimation-search'
})(EstimationSearchForm)

export default EstimationSearchForm